require('dotenv').config()

// Initialize express app and listen for incoming requests
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const db = require('./app/database/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const multer = require('multer');
const router = express.Router();
const csvtojson = require('csvtojson');

// Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename to be unique
  },
});

const upload = multer({ storage: storage });

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' })
}

// Routes
app.post('/generateMahasiswa', authenticateToken, async (req, res) => {
  const { nim, nama, angkatan } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('default', salt)
    const user = await db.query(`INSERT INTO public.users (username, password, role, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`, [nim, hashedPassword, 'mahasiswa']);

    // Simpan data mahasiswa ke database
    await db.query(`
      INSERT INTO public.mahasiswas (nim, nama, angkatan, status, user_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [nim, nama, angkatan, 'Aktif', user.id]);

    res.status(201).json({ message: 'Data mahasiswa berhasil disimpan' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menyimpan data mahasiswa' });
  }
});

app.get('/generateMahasiswaBatch', async (req, res) => {
  try {
    // // Baca file CSV dan konversi ke JSON
    const jsonArray = await csvtojson({
      delimiter: ';',
      headers: ['nim', 'nama', 'angkatan'],
    }).fromFile('batch.csv');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('default', salt);

    // Loop melalui setiap baris dan masukkan ke database
    for (const mahasiswa of jsonArray) {
      const { nim, nama, angkatan } = mahasiswa;

      // Generate akun dan masukkan ke database
      const user = await db.query('INSERT INTO users (username, password, role, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *', [nim, hashedPassword, 'mahasiswa']);
      // const user = userResult.rows[0];
    
      // Masukkan data mahasiswa ke tabel 'mahasiswas'
      const mahasiswaResult = await db.query(`
        INSERT INTO public.mahasiswas (nim, nama, angkatan, status, user_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `, [nim, nama, angkatan, 'Aktif', user.id]);

      // const mahasiswaData = mahasiswaResult.rows[0];

      console.log(`Akun untuk ${nim} telah dibuat`);
    }

    res.status(200).json({ message: 'Batch generate akun selesai' });

  } catch (error) {
    console.error('Error during batch generate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/token', async (req, res) => {
  try {
    const token = req.body.refreshToken
    const refreshTokens = await db.query(`SELECT * FROM public."refreshTokens" WHERE tokens = $1`, [token])

    if (token == null) return res.sendStatus(401)
    
    if (!refreshTokens[0]) return res.sendStatus(403)
    
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ username: user.username })
      res.json({ accessToken: accessToken })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Gagal memproses permintaan token' });
  }
});

// app.get('/users', authenticateToken, async (req, res) => {
//   const users = await db.query(`SELECT * FROM public.users`)
//   res.json(users.filter(user => user.username === req.user.username))
// })

// Entry Pengambilan IRS per Semester (SRS-XXX-003)
app.post('/irs', authenticateToken, async (req, res) => {
  const { id, semester, mata_kuliah, sks, nim } = req.body;
  const username = req.user.username;

  try {
    // Simpan data IRS ke database
    await db.query(`
      INSERT INTO public.irs (id, semester, mata_kuliah, sks, nim)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, semester, mata_kuliah, sks, nim]);

    res.status(201).json({ message: 'Data IRS berhasil disimpan' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menyimpan data IRS' });
  }
});

// Entry Prestasi Akademik KHS per Semester (SRS-XXX-004)
app.post('/khs', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { semester_aktif, sks, sks_kumulatif, ip, ip_kumulatif, status_konfirmasi, nim } = req.body;
    const username = req.user.username;
    const file = req.file;
    const filePathRelative = 'server/uploads/1700096707662-2_Algorithm Evaluation.pdf';


    // Simpan data KHS ke database
    await db.query(`
      INSERT INTO public.khs (semester_aktif, sks, sks_kumulatif, ip, ip_kumulatif, status_konfirmasi, file, nim)
      VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT id FROM public.mahasiswa WHERE nim = $8))
    `, [semester_aktif, sks, sks_kumulatif, ip, ip_kumulatif, status_konfirmasi, file, nim, username]);

    res.status(201).json({ message: 'Data KHS berhasil disimpan' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menyimpan data KHS' });
  }
});


// Entry Progress PKL (SRS-XXX-005)
app.post('/pkl', authenticateToken, async (req, res) => {
  const { nilai, semester, status_konfirmasi, file, nim } = req.body;
  const username = req.user.username;

  try {
    // Simpan data progress PKL ke database
    await db.query(`
      INSERT INTO public.pkl (nilai, semester, status_konfirmasi, file, nim)
      VALUES ($1, $2, $3, $4, (SELECT id FROM public.mahasiswa WHERE nim = $5))
    `, [nilai, semester, status_konfirmasi, file, nim]);

    res.status(201).json({ message: 'Data progress PKL berhasil disimpan' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menyimpan data progress PKL' });
  }
});


// Entry Progress Skripsi (SRS-XXX-006) dengan Tanggal Lulus/Sidang dan Lama Studi dalam Semester
app.post('/skripsi', authenticateToken, async (req, res) => {
  const { nilai, tanggal, semester, status_konfirmasi, file, nim } = req.body;
  const username = req.user.username;

  try {
    // Simpan data progress skripsi ke database
    await db.query(`
      INSERT INTO public.skripsi (nilai, tanggal, semester, status_konfirmasi, file, nim)
      VALUES ($1, $2, $3, $4, $5, (SELECT id FROM public.mahasiswa WHERE nim = $6))
    `, [nilai, tanggal, semester, status_konfirmasi, file, nim]);

    res.status(201).json({ message: 'Data progress skripsi berhasil disimpan' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menyimpan data progress skripsi' });
  }
});

// Verifikasi progress studi
app.put('/verifikasiprogress', authenticateToken, async (req, res) => {
  const { id, status_konfirmasi } = req.body;

  try {
    // Update status konfirmasi progress studi
    await db.query(`
      UPDATE public.irs SET status_konfirmasi = $1 WHERE id = $2
    `, [status_konfirmasi, id]);

    res.status(200).json({ message: 'Verifikasi progress studi berhasil' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal verifikasi progress studi' });
  }
});

// Pencarian progress studi mahasiswa
app.get('/progress-mahasiswa', authenticateToken, async (req, res) => {
  const { nim, name } = req.query;

  try {
    // Lakukan pencarian progress studi mahasiswa berdasarkan nim dan nama
    const progress = await db.query(`
      SELECT * FROM public.irs ir
      JOIN public.mahasiswa m ON ir.nim = CAST(m.nim AS INTEGER)
      WHERE ($1 IS NULL OR ir.nim = CAST($1 AS INTEGER)) AND ($2 IS NULL OR m.name ILIKE $2)
    `, [nim, `%${name}%`]);

    res.status(200).json({ progress: progress.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal melakukan pencarian progress studi mahasiswa' });
  }
});


app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  // const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt)
  // const hashedPassword = await bcrypt.hash(req.body.password, 10)
  try {
    const user = await db.query(`
      INSERT INTO public.users (username, email, password, role, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    `, [username, email, hashedPassword, role])

    res.status(201).send('Akun berhasil disisipkan');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal menyisipkan data akun' });
  }
});

app.post('/login', async (req, res) => {
  const users = await db.query('SELECT * FROM public.users')
  const user = users.find(user => user.username === req.body.username)
  if (user == null) {
    return res.status(400).send('Tidak dapat menemukan user')
  } 
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
      await db.query(`
        INSERT INTO public."refreshTokens" (token)
        VALUES ($1)
      `, [refreshToken])
      const responseData = {
        ...user,  // Spread user properties
        accessToken: accessToken,
        refreshToken: refreshToken
      }
      res.json(responseData)
    } else {
      res.status(401).send('Username atau password salah')
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal login' });
  }
});

app.delete('/logout', async (req, res) => {
  try {
    await db.query(`
      DELETE FROM public."refreshTokens" WHERE tokens = $1
    `, [req.body.refreshToken])
    res.status(204).send('Berhasil logout')
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Gagal logout' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
});