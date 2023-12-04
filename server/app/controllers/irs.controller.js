const { IRS, Mahasiswa, Dosen } = require("../models");
const fs = require("fs").promises;
const userController = require("./user.controller");

exports.submitIRS = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;

    const lastSubmittedIRS = await IRS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
      },
      order: [["semester_aktif", "DESC"]],
    });

    if (lastSubmittedIRS) {
      if (req.body.semester_aktif != lastSubmittedIRS.semester_aktif + 1) {
        return res.status(400).json({ message: "IRS semester must be sequential." });
      }
    }

    let existingIRS = await IRS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        semester_aktif: req.body.semester_aktif,
      },
    });

    if (existingIRS) {
      if (req.file) {
        if (existingIRS.file) {
          await fs.unlink(existingIRS.file);
        }
        existingIRS.file = req.file.path;
      }
      existingIRS.sks = req.body.sks;
      await existingIRS.save();

      return res.send({ message: "IRS was updated successfully." });
    }

    const newIRS = {
      mahasiswa_nim: mahasiswa.nim,
      semester_aktif: req.body.semester_aktif,
      sks: req.body.sks,
      file: req.file.path,
    };

    await IRS.create(newIRS);

    res.status(201).send({ message: "IRS was created successfully." });
  } catch (err) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getIRSByMahasiswa = async (req, res) => {
  try {
    const irs = await IRS.findAll({
      where: {
        mahasiswa_nim: req.mahasiswa.nim,
      },
    });

    res.status(200).send(irs);

  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving IRS." });
  }
}

exports.getIRSByDosen = async (req, res) => {
  try {
    const dosen = req.dosen;
    const list_mhs = await Mahasiswa.findAll({ where: { nip_dosen: dosen.nip } });
    const list_irs = await IRS.findAll({ where: { mahasiswa_nim: list_mhs.map(mhs => mhs.nim), status_verifikasi: "belum" } });

    res.status(200).json(list_irs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Some error occurred while retrieving IRS." });
  }
}

exports.getAllIRS = async (req, res) => {
  try {
    const irs = await IRS.findAll();
    res.status(200).send(irs);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving IRS." });
  }
};

exports.downloadIRS = (req, res) => {
  IRS.findOne({
    where: {
      mahasiswaId: req.mahasiswaId,
      semesterAktif: req.params.semester_aktif,
    },
  })
    .then((irs) => {
      if (!irs) {
        res.status(404).send({ message: "File not found!" });
        return;
      }
      const file = fs.createReadStream(irs.file);
      const filename = "IRS_" + irs.semesterAktif;
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      file.pipe(res);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving IRS." });
    });
};

exports.waliIRS = async (req, res) => {
  try {
    const dosen = await Dosen.findOne({ user: req.userId });
    const list_mhs = await Mahasiswa.findAll({ kodeWali: dosen.id });
    // Get all irs from list_mhs that have status_konfirmasi == belum
    let list_irs = [];
    for (let i = 0; i < list_mhs.length; i++) {
      let mhs = list_mhs[i];
      let irs = await IRS.findAll({
        where: {
          mahasiswaId: list_mhs[i].id,
          statusKonfirmasi: "belum",
        },
      });
      // Merge mhs data and irs data
      for (let j = 0; j < irs.length; j++) {
        let obj = {
          nim: mhs.nim,
          name: mhs.name,
          angkatan: mhs.angkatan,
          semester_aktif: irs[j].semesterAktif,
          sks: irs[j].sks,
          file: irs[j].file,
          irs_id: irs[j].id,
        };
        list_irs.push(obj);
      }
    }

    // Send the data
    res.status(200).send(list_irs);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving IRS." });
  }
};

exports.verifyIRS = async (req, res) => {
  try {
    const dosen = req.dosen;
    const mhsList = await Mahasiswa.findAll({ where: { nip_dosen: dosen.nip } });
    const mhs = mhsList.find((mhs) => mhs.nim == req.params.nim);

    await IRS.update(
      {
        status_verifikasi: "sudah",
      },
      {
        where: {
          mahasiswa_nim: mhs.nim,
          semester_aktif: req.params.semester_aktif,
        },
      }
    );

    res.status(200).send({ message: "OK" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while updating IRS." });
  }
};

exports.deleteIRS = async (req, res) => {
  try {
    const dosen = req.dosen;
    const mhs = await Mahasiswa.findOne({ where: { nip_dosen: dosen.nip, nim: req.params.nim } });

    if (!mhs) {
      return res.status(404).send({ message: "Mahasiswa not found!" });
    }

    const irs = await IRS.findOne({
      where: {
        mahasiswa_nim: mhs.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (!irs) {
      return res.status(404).send({ message: "IRS not found!" });
    }

    await fs.unlink(irs.file);
    await IRS.destroy({
      where: {
        mahasiswa_nim: mhs.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    res.status(200).send({ message: "IRS was deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while processing the request." });
  }
};

exports.deleteAllIRS = (req, res) => {
  IRS.destroy({ truncate: true })
    .then(() => {
      res.status(200).send({ message: "All IRS records were deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while deleting IRS records." });
    });
};