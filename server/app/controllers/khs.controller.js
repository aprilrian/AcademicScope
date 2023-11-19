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