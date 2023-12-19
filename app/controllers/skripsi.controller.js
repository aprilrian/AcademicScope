const { IRS, Skripsi, Mahasiswa, Dosen } = require("../models");
const fs = require("fs").promises;
const sequelize = require("sequelize");
const { getRekapByDosen } = require("../controllers/user.controller");

exports.submitSkripsi = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const { status, nilai, semester, tanggal_lulus, tanggal_sidang } = req.body;

    let findSkripsi = await Skripsi.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        semester: semester,
      },
    });

    let irs = await IRS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
      },
      order: sequelize.literal('"semester_aktif"::int DESC'),
    });

    if (!irs) {
      return res.status(400).send({ message: "Please fill IRS first!" });
    }

    if (status === "belum ambil") {
      return res.status(400).send({ message: "You are not eligible to submit Skripsi" });
    }

    if (findSkripsi) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.send({ message: "Your skripsi is already exists!" });
    } else {
      const newSkripsi = {
        status: status,
        nilai: nilai,
        semester: semester,
        tanggal_lulus: tanggal_lulus,
        tanggal_sidang: tanggal_sidang,
        lama_studi: irs.semester_aktif,
        file: req.file.path,
        mahasiswa_nim: mahasiswa.nim,
      };

      await Skripsi.create(newSkripsi);
      
      mahasiswa.status = "lulus";
      await mahasiswa.save();

      res.status(201).send({ message: "Skripsi was created successfully." });
    }
  } catch (err) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while creating the Skripsi." });
  }
};

exports.getSkripsi = async (req, res) => {
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

    const skripsis = await Promise.all(mahasiswas.map(async (mahasiswa) => {
      const skripsi = await Skripsi.findOne({
        attributes: [['mahasiswa_nim', 'nim'], 'nilai', 'semester'],
        where: {
          mahasiswa_nim: mahasiswa.nim,
          status: status,
          status_verifikasi: 'sudah',
        },
      });

      if (skripsi) {
        skripsi.dataValues.nama = mahasiswa.nama
        skripsi.dataValues.angkatan = mahasiswa.angkatan
      };

      return skripsi;
    }));

    res.status(200).send(skripsis.filter((skripsi) => skripsi !== null));
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error retrieving Skripsi.' });
  }
}

exports.getRekapSkripsi = async (req, res) => {
  try {
    const rekapList = {};
    let mahasiswas;

    for (let angkat = 2016; angkat <= 2023; angkat++) {
      const angkatan = angkat.toString();
      if (!req.dosen){
        mahasiswas = await Mahasiswa.findAll({
          where: {
            angkatan: angkatan,
          },
        });
      } else {
        mahasiswas = await Mahasiswa.findAll({
          where: {
            nip_dosen: req.dosen.nip,
            angkatan: angkatan,
          },
        });
      }

      let sudah = 0;
      let belum = 0;

      await Promise.all(mahasiswas.map(async (mahasiswa) => {
        const skripsi = await Skripsi.findOne({
          where: {
            mahasiswa_nim: mahasiswa.nim,
            status_verifikasi: 'sudah',
          },
        });

        if (skripsi) {
          if (skripsi.status === "belum ambil") {
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
    res.status(500).send({ message: error.message || 'Error retrieving Rekap Skripsi.' });
  }
};

exports.getSkripsiBelumByDosen = async (req, res) => {
  try {
    const dosen = req.dosen;
    const mahasiswas = await Mahasiswa.findAll({ where: { nip_dosen: dosen.nip } });

    const unverifiedSkripsi = [];

    for (const mahasiswa of mahasiswas) {
      const skripsis = await Skripsi.findAll({
        where: {
          mahasiswa_nim: mahasiswa.nim,
          status_verifikasi: "belum",
        },
      });

      for (const skripsi of skripsis) {
        unverifiedSkripsi.push({
          id: skripsi.id,
          nim: mahasiswa.nim,
          nama: mahasiswa.nama,
          angkatan: mahasiswa.angkatan,
          semester: skripsi.semester,
          nilai: skripsi.nilai,
        });
      }
    }

    res.status(200).send(unverifiedSkripsi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Terjadi kesalahan saat mengambil data Skripsi." });
  }
};

exports.getAllSkripsi = async (req, res) => {
  try {
    const skripsi = await Skripsi.findAll();

    res.status(200).send(skripsi);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.verifySkripsi = async (req, res) => {
  try {
    const dosen = req.dosen;
    const { nim } = req.params;

    const mahasiswa = await Mahasiswa.findOne({
      where: {
        nim: nim,
      },
    });

    if (!mahasiswa) {
      return res.status(404).send({ message: 'Mahasiswa not found!' });
    }

    if (mahasiswa.nip_dosen !== dosen.nip) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }

    const skripsi = await Skripsi.findOne({
      where: {
        mahasiswa_nim: nim,
      },
    });

    if (!skripsi) {
      return res.status(404).send({ message: 'Skripsi not found!' });
    }

    skripsi.status_verifikasi = 'sudah';
    await skripsi.save();

    res.status(200).send({ message: 'Skripsi was verified successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error verifying Skripsi.' });
  }
};

exports.deleteSkripsi = async (req, res) => {
  try {
    const skripsi = await Skripsi.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
      },
    });

    if (!skripsi) {
      return res.status(404).send({ message: "Skripsi not found!" });
    }

    if (skripsi.status_verifikasi == "sudah") {
      return res.status(400).send({ message: "Skripsi has already verified!" });
    }

    await skripsi.destroy();

    res.status(200).send({ message: "Skripsi was deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error deleting Skripsi." });
  }
};

exports.editSkripsi = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const { nilai, semester, tanggal_lulus, tanggal_sidang } = req.body;

    const skripsi = await Skripsi.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
      },
    });

    if (!skripsi) {
      return res.status(400).send({ message: "Skripsi not found!" });
    }

    if (skripsi.status_verifikasi == "sudah") {
      return res.status(400).send({ message: "Skripsi has already verified!" });
    }

    await skripsi.update({
      nilai: nilai,
      semester: semester,
      tanggal_lulus: tanggal_lulus,
      tanggal_sidang: tanggal_sidang,
    });

    res.status(200).send({ message: "Skripsi was updated successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error updating Skripsi." });
  }
};

exports.showSkripsi = async (req, res) => {
  try {
    const skripsi = await Skripsi.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
      },
    });

    if (!skripsi) {
      return res.status(404).send({ message: "File not found!" });
    }
    const sanitizedFileName = skripsi.file.replace(/\\/g, '/');
    pathFile = `${sanitizedFileName}`
    console.log(pathFile);
    res.status(200).send(pathFile)
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.downloadSkripsi = async (req, res) => {
  try {
    const skripsi = await Skripsi.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (!skripsi) {
      return res.status(404).send({ message: "File not found!" });
    }

    const sanitizedFileName = skripsi.file.replace(/\\/g, '/');
    pathFile = `http://localhost:8080/${sanitizedFileName}`
    console.log(pathFile);
    res.redirect(pathFile);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
}