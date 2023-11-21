const db = require('../models');
const fs = require('fs');
const { PKL, Mahasiswa, Dosen } = require('../models');
const PKLModel = db.PKL;
const MahasiswaModel = db.Mahasiswa;
const DosenModel = db.Dosen;

exports.submitPKL = async (req, res) => {
  try {
    const existingPKL = await PKLModel.findOne({
      where: {
        mahasiswaId: req.mahasiswaId,
        semester: req.body.semester,
      },
    });

    if (!existingPKL) {
      const pkl = await PKLModel.create({
        nilai: req.body.nilai,
        semester: req.body.semester,
        statusKonfirmasi: 'belum',
        file: req.file.path,
        mahasiswaId: req.mahasiswaId,
      });

      res.status(201).send({ message: 'PKL was submitted successfully!', pkl });
    } else {
      // Hapus file PKL yang sudah ada dan update dengan yang baru
      fs.unlink(existingPKL.file, async (err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        const updatedPKL = await existingPKL.update({
          file: req.file.path,
          nilai: req.body.nilai,
          semester: req.body.semester,
        });

        res.send({ message: 'PKL was updated successfully!', pkl: updatedPKL });
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error submitting PKL.' });
  }
};

exports.getPKL = async (req, res) => {
  try {
    const pklData = await PKLModel.findAll({
      where: { mahasiswaId: req.mahasiswaId },
    });
    res.status(200).send(pklData);
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
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

exports.getWaliPKL = async (req, res) => {
  try {
    const dosen = await DosenModel.findOne({ user: req.userId });
    const resultMhs = await MahasiswaModel.findAll({ kodeWali: dosen.id });
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