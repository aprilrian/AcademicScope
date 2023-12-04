const { IRS, Mahasiswa, Dosen } = require("../models");
const fs = require("fs").promises;

exports.submitIRS = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
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

exports.getAllIRS = async (req, res) => {
  try {
    let array_mahasiswa = await Mahasiswa.findAll({});
    let array_irs = await IRS.findAll({});

    let result = [];
    for (let i = 0; i < array_mahasiswa.length; i++) {
      let irs_mahasiswa = [];
      for (let j = 0; j < array_irs.length; j++) {
        // cek tiap irs yang punya nilai mahasiswa == mahasiswa.id
        if (array_mahasiswa[i].id === array_irs[j].mahasiswaId) {
          let obj_irs = {
            semester_aktif: array_irs[j].semesterAktif,
            sks: array_irs[j].sks,
            file: array_irs[j].file,
            status_konfirmasi: array_irs[j].statusKonfirmasi,
          };

          irs_mahasiswa.push(obj_irs);
        }
      }
      let obj_mahasiswa = {
        name: array_mahasiswa[i].name,
        nim: array_mahasiswa[i].nim,
        angkatan: array_mahasiswa[i].angkatan,
        irs: irs_mahasiswa,
      };

      result.push(obj_mahasiswa);
    }

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving IRS." });
  }
};

//download irs file dari database berdasarkan nim mahasiswa dan semester
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
    const mhs = await Mahasiswa.findOne({ nim: req.params.nim });
    const dosen = await Dosen.findOne({ user: req.userId });

    if (!dosen.id === mhs.kodeWali) {
      res.status(403).send(`You are not the academic advisor of ${mhs.name}`);
      return;
    }

    await IRS.update(
      { statusKonfirmasi: "sudah" },
      {
        where: {
          mahasiswaId: mhs.id,
          semesterAktif: req.params.semester_aktif,
        },
      }
    );

    res.status(200).send({ message: "OK" });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while updating IRS." });
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