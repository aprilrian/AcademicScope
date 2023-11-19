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