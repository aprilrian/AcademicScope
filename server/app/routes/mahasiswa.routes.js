const express = require('express')
const router = express.Router()
const db = require('../app/models')

router.get('/mahasiswas', async (req, res) => {
    try {
      const mahasiswas = await db.Mahasiswa.findAll();
      res.json(mahasiswas);
    } catch (error) {
      console.error('Error retrieving mahasiswas:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
router.post('/generateMahasiswa', authenticateToken, async (req, res) => {
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
  
router.get('/generateMahasiswaBatch', async (req, res) => {
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

module.exports = router