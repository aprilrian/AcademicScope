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

      if (pkl) {
        pkl.dataValues.nama = mahasiswa.nama
      };

      return pkl;
    }));

    res.status(200).send(pkls.filter((pkl) => pkl !== null));
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
  }
}

exports.getRekapPKLByDosen = async (req, res) => {
  try {
    const dosen = req.dosen;

    const mahasiswas = await Mahasiswa.findAll({
      where: {
        nip_dosen: dosen.nip,
      },
    });

    const pkls = await Promise.all(mahasiswas.map(async (mahasiswa) => {
      const pkl = await PKL.findOne({
        where: {
          mahasiswa_nim: mahasiswa.nim,
          status_verifikasi: 'sudah',
        },
      });

      return pkl;
    }));

    const rekapProgress = {};

    mahasiswas.forEach((mahasiswa) => {
      const angkatan = mahasiswa.angkatan;
      if (!rekapProgress[angkatan]) {
        rekapProgress[angkatan] = { sudah: 0, belum: 0 };
      }
      if (pkls.find((pkl) => pkl && pkl.mahasiswa_nim === mahasiswa.nim)) {
        rekapProgress[angkatan].sudah += 1;
      } else {
        rekapProgress[angkatan].belum += 1;
      }
    });

    res.status(200).send({ tahun: rekapProgress});
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