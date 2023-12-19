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
      return res.status(400).send({ message: "Your PKL already exists!" });
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

exports.getPKLBelumByDosen = async (req, res) => {
  try {
    const dosen = req.dosen;
    const mahasiswas = await Mahasiswa.findAll({ where: { nip_dosen: dosen.nip } });

    const unverifiedPKL = [];

    for (const mahasiswa of mahasiswas) {
      const pkls = await PKL.findAll({
        where: {
          mahasiswa_nim: mahasiswa.nim,
          status_verifikasi: "belum",
        },
      });

      for (const pkl of pkls) {
        unverifiedPKL.push({
          id: pkl.id,
          nim: mahasiswa.nim,
          nama: mahasiswa.nama,
          angkatan: mahasiswa.angkatan,
          semester: pkl.semester,
          nilai: pkl.nilai,
        });
      }
    }

    res.status(200).send(unverifiedPKL);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Terjadi kesalahan saat mengambil data PKL." });
  }
};

exports.getPKL = async (req, res) => {
  try {
    const { status, angkatan } = req.params;
    let mahasiswas;

    if (req.dosen) {
      mahasiswas = await Mahasiswa.findAll({
        where: {
          nip_dosen: req.dosen.nip,
          angkatan: angkatan,
        },
      });
    } else {
      mahasiswas = await Mahasiswa.findAll({
        where: {
          angkatan: angkatan,
        },
      });
    }

    const pkls = await Promise.all(mahasiswas.map(async (mahasiswa) => {
      const pkl = await PKL.findOne({
        attributes: [['mahasiswa_nim', 'nim'], 'nilai', 'semester'],
        where: {
          mahasiswa_nim: mahasiswa.nim,
          status: status,
          status_verifikasi: 'sudah',
        },
      });

      if (pkl) {
        pkl.dataValues.nama = mahasiswa.nama
        pkl.dataValues.angkatan = mahasiswa.angkatan
      };

      return pkl;
    }));

    res.status(200).send(pkls.filter((pkl) => pkl !== null));
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
  }
}
exports.getRekapPKL = async (req, res) => {
  try {
    const rekapList = {};
    let mahasiswas;

    for (let angkat = 2016; angkat <= 2023; angkat++) {
      const angkatan = angkat.toString();
      if (!req.dosen) {
        mahasiswas = await Mahasiswa.findAll({
          where: {
            angkatan: angkatan,
          },
        });
      } else {
        mahasiswas = await Mahasiswa.findAll({
          where: {
            angkatan: angkatan,
            nip_dosen: req.dosen.nip,
          },
        });
      }

      let sudah = 0;
      let belum = 0;

      await Promise.all(mahasiswas.map(async (mahasiswa) => {
        const pkl = await PKL.findOne({
          where: {
            mahasiswa_nim: mahasiswa.nim,
            status_verifikasi: 'sudah',
          },
        });

        if (pkl) {
          if (pkl.status === "belum ambil") {
            belum++;
          } else {
            sudah++;
          }
        }
      }));

      const rekap = {
        sudah: sudah,
        belum: belum,
      };

      rekapList[angkatan] = rekap;
    }

    res.status(200).send({ tahun: rekapList });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving Rekap PKL.' });
  }
};

exports.getAllPKL = async (req, res) => {
  try {
    const pkls = await PKL.findAll();

    res.status(200).send(pkls);
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving PKL.' });
  }
};

exports.showPKL = async (req, res) => {
  try {
    const pkl = await PKL.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
      },
    });

    if (!pkl) {
      return res.status(404).send({ message: "File not found!" });
    }
    const sanitizedFileName = pkl.file.replace(/\\/g, '/');
    pathFile = `${sanitizedFileName}`
    console.log(pathFile);
    res.status(200).send(pathFile)
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.downloadPKL = async (req, res) => {
  try {
    const pkl = await PKL.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (!pkl) {
      return res.status(404).send({ message: "File not found!" });
    }

    const sanitizedFileName = pkl.file.replace(/\\/g, '/');
    pathFile = `http://localhost:8080/${sanitizedFileName}`
    console.log(pathFile);
    res.redirect(pathFile);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

exports.verifyPKL = async (req, res) => {
  try {
    const dosen = req.dosen;
    const { nim } = req.params;

    const mahasiswa = await Mahasiswa.findOne({
      where: { nim: nim },
    });

    if (!mahasiswa) {
      res.status(404).send({ message: 'Mahasiswa not found' });
      return;
    }

    if (mahasiswa.nip_dosen !== dosen.nip) {
      res.status(401).send({ message: 'Unauthorized!' });
      return;
    }

    const pkl = await PKL.findOne({
      where: { mahasiswa_nim: nim },
    });

    if (!pkl) {
      res.status(404).send({ message: 'PKL not found' });
      return;
    }

    await pkl.update({ status_verifikasi: 'sudah' });

    res.status(200).send({ message: 'PKL verification successful!' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error verifying PKL.' });
  }
}

exports.editPKL = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const { nilai, semester } = req.body;

    let pkl = await PKL.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
      },
    });

    if (!pkl) {
      return res.status(400).send({ message: "PKL not found!" });
    }

    if (pkl.status_verifikasi == "sudah") {
      return res.status(400).send({ message: "PKL has already verified!" });
    }

    await pkl.update({
      nilai: nilai,
      semester: semester,
    });

    res.status(200).send({ message: "PKL was updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while updating the PKL." });
  }
}

exports.deletePKL = async (req, res) => {
  try {
    const pkl = await PKL.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
      },
    });

    if (!pkl) {
      res.status(404).send({ message: 'PKL not found!' });
      return;
    }

    await pkl.destroy();

    res.status(200).send({ message: 'PKL deleted successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error deleting PKL.' });
  }
}