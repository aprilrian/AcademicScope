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