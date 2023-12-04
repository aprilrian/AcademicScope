const fs = require('fs');
const { PKL, Mahasiswa, Dosen } = require('../models');

exports.submitPKL = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({ where: { user_id: req.user_id } });

    if (!mahasiswa) {
      return res.status(404).send({ message: "Mahasiswa not found!" });
    }

    let pkl = await PKL.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        semester: req.body.semester,
      },
    });

    if (pkl) {
      if (req.file) {
        if (pkl.file) {
          // Use a callback function to handle unlink completion or errors
          fs.unlink(pkl.file, (unlinkError) => {
            if (unlinkError) {
              console.error("Error deleting PKL file:", unlinkError);
            }
          });
        }
        pkl.file = req.file.path;
      }
      pkl.nilai = req.body.nilai;
      await pkl.save();

      res.send({ message: "PKL was updated successfully." });
    } else {
      const newPKL = {
        status: req.body.status,
        nilai: req.body.nilai,
        semester: req.body.semester,
        status_verifikasi: "sedang diverifikasi",
        file: req.file.path,
        mahasiswa_nim: mahasiswa.nim,
      };

      await PKL.create(newPKL);

      res.status(201).send({ message: "PKL was created successfully." });
    }
  } catch (err) {
    if (req.file) {
      // Use a callback function to handle unlink completion or errors
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting uploaded file:", unlinkError);
        }
      });
    }
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while creating the PKL." });
  }
};


exports.getRekapPKL = async (req, res) => {
  try {
    const resultMhs = await MahasiswaModel.findAll();
    const resultPKL = await PKLModel.findAll();

    let result = [];

    for (let i = 0; i < resultMhs.length; i++) {
      let ck = false;
      for (let j = 0; j < resultPKL.length; j++) {
        if (resultMhs[i].id === resultPKL[j].mahasiswaId) {
          result.push({
            id: resultPKL[j].id,
            name: resultMhs[i].name,
            nim: resultMhs[i].nim,
            angkatan: resultMhs[i].angkatan,
            nilai: resultPKL[j].nilai,
            semester: resultPKL[j].semester,
            status_konfirmasi: resultPKL[j].statusKonfirmasi,
            file: resultPKL[j].file,
          });
          ck = true;
          break;
        }
      }
      if (!ck) {
        result.push({
          name: resultMhs[i].name,
          nim: resultMhs[i].nim,
          angkatan: resultMhs[i].angkatan,
          status_konfirmasi: 'belum',
        });
      }
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
  }
};

exports.getPKLByDosen = async (req, res) => {
  try {
    const resultMhs = await Mahasiswa.findAll({ nip_dosen: req.dosen_nip });
    const resultPKL = await PKL.findAll();

    let result = [];
    for (let i = 0; i < resultMhs.length; i++) {
      let ck = false;
      for (let j = 0; j < resultPKL.length; j++) {
        if (resultMhs[i].id === resultPKL[j].mahasiswa_nim) {
          result.push({
            id: resultPKL[j].id,
            name: resultMhs[i].nama,
            nim: resultMhs[i].nim,
            angkatan: resultMhs[i].angkatan,
            status: resultPKL[j].status,
            nilai: resultPKL[j].nilai,
            semester: resultPKL[j].semester,
            status_verifikasi: resultPKL[j].status_verifikasi,
            file: resultPKL[j].file,
          });
          ck = true;
          break;
        }
      }
      if (!ck) {
        result.push({
          name: resultMhs[i].name,
          nim: resultMhs[i].nim,
          angkatan: resultMhs[i].angkatan,
          status_konfirmasi: 'belum',
        });
      }
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
  }
};

exports.getBelumPKL = async (req, res) => {
  try {
    const dosen = await DosenModel.findOne({ user: req.userId });
    const resultMhs = await MahasiswaModel.findAll({ kodeWali: dosen.id });
    const resultPKL = await PKLModel.findAll();

    let result = [];
    for (let i = 0; i < resultMhs.length; i++) {
      let ck = false;
      for (let j = 0; j < resultPKL.length; j++) {
        if (
          resultMhs[i].id === resultPKL[j].mahasiswaId &&
          resultPKL[j].statusKonfirmasi === 'belum'
        ) {
          result.push({
            id: resultPKL[j].id,
            name: resultMhs[i].name,
            nim: resultMhs[i].nim,
            angkatan: resultMhs[i].angkatan,
            nilai: resultPKL[j].nilai,
            semester: resultPKL[j].semester,
            status_konfirmasi: resultPKL[j].statusKonfirmasi,
            file: resultPKL[j].file,
          });
          ck = true;
          break;
        }
      }
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
  }
};

exports.downloadPKL = async (req, res) => {
  try {
    const pkl = await PKLModel.findOne({
      where: { mahasiswaId: req.mahasiswaId },
    });

    if (!pkl) {
      res.status(404).send({ message: 'File not found!' });
      return;
    }

    const file = fs.createReadStream(pkl.file);
    const filename = 'PKL';
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    file.pipe(res);
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
  }
};

exports.deleteAllPKL = async (req, res) => {
  try {
    await PKLModel.destroy({ where: {} });

    res.status(200).send({ message: 'All PKL records deleted successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error deleting PKL records.' });
  }
};

exports.VerifPKL = async (req, res) => {
  try {
    const dosen = await DosenModel.findOne({ user: req.userId });
    const mahasiswa = await MahasiswaModel.findOne({
      where: { kodeWali: dosen.id, nim: req.params.nim },
    });

    if (!mahasiswa) {
      res.status(404).send({ message: 'Mahasiswa not found' });
      return;
    }

    const pkl = await PKLModel.findOne({
      where: { mahasiswaId: mahasiswa.id },
    });

    if (!pkl) {
      res.status(404).send({ message: 'PKL not found' });
      return;
    }

    await pkl.update({ statusKonfirmasi: 'sudah' });

    res.status(200).send({ message: 'PKL verification successful!' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error verifying PKL.' });
  }
};


// // Entry Progress PKL (SRS-XXX-005)
// app.post('/pkl', authenticateToken, async (req, res) => {
//     const { nilai, semester, status_konfirmasi, file, nim } = req.body;
//     const username = req.user.username;
  
//     try {
//       // Simpan data progress PKL ke database
//       await db.query(`
//         INSERT INTO public.pkl (nilai, semester, status_konfirmasi, file, nim)
//         VALUES ($1, $2, $3, $4, (SELECT id FROM public.mahasiswa WHERE nim = $5))
//       `, [nilai, semester, status_konfirmasi, file, nim]);
  
//       res.status(201).json({ message: 'Data progress PKL berhasil disimpan' });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ error: 'Gagal menyimpan data progress PKL' });
//     }
//   });