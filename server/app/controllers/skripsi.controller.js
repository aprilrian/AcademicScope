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
  