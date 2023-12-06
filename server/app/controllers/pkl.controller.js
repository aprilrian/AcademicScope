const { PKL, Mahasiswa, Dosen } = require('../models');
const fs = require('fs').promises;

exports.submitPKL = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const { status, nilai, semester } = req.body;

    let pkl = await PKL.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        semester: semester,
      },
    });

    if (status == "belum ambil") {
      return res.status(400).send({ message: "You are not eligible to submit PKL" });
    }

    if (pkl) {
      return res.status(400).send({ message: "PKL already exists!" });
    }

    await PKL.create({
      mahasiswa_nim: mahasiswa.nim,
      status: status,
      nilai: nilai,
      semester: semester,
      file: req.file.path,
    });

    res.status(201).send({ message: "PKL was created successfully." });
  } catch (err) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while creating the PKL." });
  }
};

exports.getPKLByDosen = async (req, res) => {
  try {
    const dosen = req.dosen;
    const { status, angkatan } = req.params;
    const mahasiswas = await Mahasiswa.findAll({
      where: {
        nip_dosen: dosen.nip,
        angkatan: angkatan,
      },
    });

    const pkls = await Promise.all(mahasiswas.map(async (mahasiswa) => {
      const pkl = await PKL.findOne({
        where: {
          mahasiswa_nim: mahasiswa.nim,
          status: status,
          status_verifikasi: 'sudah',
        },
      });

      pkl.dataValues.mahasiswa = {
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
      };

      return pkl;
    }));

    res.status(200).send(pkls);
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
  }
}

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