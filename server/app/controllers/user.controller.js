const { db } = require("../models");
const User = db.user;
const bcrypt = require('bcrypt');
const fs = require('fs');
const csvtojson = require('csvtojson');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
}

exports.mahasiswaBoard = (req, res) => {
  res.status(200).send("Mahasiswa Content.");
}

exports.dosenBoard = (req, res) => {
  res.status(200).send("Dosen Content.");
}

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
}

exports.departemenBoard = (req, res) => {
  res.status(200).send("Departemen Content.");
}

exports.signUpOP = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.create({
      username,
      email,
      password,
      role,
    });
    await user.save();
    res.status(201).send('Akun berhasil disisipkan');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}


// app.post('/register', async (req, res) => {
//     const { username, email, password, role } = req.body;
//     // const password = req.body.password;
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(password, salt)
//     // const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     try {
//       const user = await db.query(`
//         INSERT INTO public.users (username, email, password, role, created_at)
//         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
//       `, [username, email, hashedPassword, role])
  
//       res.status(201).send('Akun berhasil disisipkan');
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ error: 'Gagal menyisipkan data akun' });
//     }
//   });

// // Pencarian progress studi mahasiswa
// app.get('/progress-mahasiswa', authenticateToken, async (req, res) => {
//     const { nim, name } = req.query;
  
//     try {
//       // Lakukan pencarian progress studi mahasiswa berdasarkan nim dan nama
//       const progress = await db.query(`
//         SELECT * FROM public.irs ir
//         JOIN public.mahasiswa m ON ir.nim = CAST(m.nim AS INTEGER)
//         WHERE ($1 IS NULL OR ir.nim = CAST($1 AS INTEGER)) AND ($2 IS NULL OR m.name ILIKE $2)
//       `, [nim, `%${name}%`]);
  
//       res.status(200).json({ progress: progress.rows });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ error: 'Gagal melakukan pencarian progress studi mahasiswa' });
//     }
//   });