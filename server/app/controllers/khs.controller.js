const fs = require("fs");
const { KHS, Mahasiswa, Dosen } = require("../models");

const submitKHS = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({ where: { user_id: req.user_id } });

    if (!mahasiswa) {
      return res.status(404).send({ message: "Mahasiswa not found!" });
    }

    let khs = await KHS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        semester_aktif: req.body.semester_aktif,
      },
    });

    if (khs) {
      if (req.file) {
        if (khs.file) {
          // Use a callback function to handle unlink completion or errors
          fs.unlink(khs.file, (unlinkError) => {
            if (unlinkError) {
              console.error("Error deleting KHS file:", unlinkError);
            }
          });
        }
        khs.file = req.file.path;
      }
      khs.sks = req.body.sks;
      await khs.save();

      res.send({ message: "KHS was updated successfully." });
    } else {
      const newKHS = {
        semester_aktif: req.body.semester_aktif,
        sks: req.body.sks,
        file: req.file.path,
        mahasiswa_nim: mahasiswa.nim,
      };

      await KHS.create(newKHS);

      res.status(201).send({ message: "KHS was created successfully." });
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
    res.status(500).send({ message: err.message || "Some error occurred while creating the KHS." });
  }
};


const getKHS = async (req, res) => {
  try {
    const khsData = await Khs.findAll({
      where: { mahasiswaId: req.mahasiswaId },
    });
    res.status(200).send(khsData);
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while retrieving KHS." });
  }
};

// Implementasikan fungsi-fungsi lainnya sesuai kebutuhan
const getAllKHS = async (req, res) => {
  let array_mahasiswa = await Mahasiswa.find({});
  let array_khs = await Khs.find({});

  let result = [];
  for (let i = 0; i < array_mahasiswa.length; i++) {
    let khs_mahasiswa = [];
    for (let j = 0; j < array_khs.length; j++) {
      // cek tiap khs yang punya nilai mahasiswa == mahasiswa.id
      if (array_mahasiswa[i]._id.equals(array_khs[j].mahasiswa)) {
        let obj_khs = {
          semester: array_khs[j].semester_aktif,
          ip: array_khs[j].ip,
          ipk: array_khs[j].ip_kumulatif,
        };

        khs_mahasiswa.push(obj_khs);
      }
    }
    let obj_mahasiswa = {
      name: array_mahasiswa[i].name,
      nim: array_mahasiswa[i].nim,
      khs: khs_mahasiswa,
      wali: array_mahasiswa[i].kodeWali,
    };

    result.push(obj_mahasiswa);
  }

  res.status(200).send(result);
};

const downloadKHS = (req, res) => {
  Khs.findOne(
    {
      mahasiswa: req.mahasiswaId,
      semester_aktif: req.params.semester,
    },
    //if file not found return 404
    function (err, khs) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!khs) {
        res.status(404).send({ message: "File not found!" });
        return;
      }
      const file = fs.createReadStream(khs.file);
      const filename = "KHS_" + khs.semester_aktif;
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      file.pipe(res);
    }
  );
};

const waliKHS = async (req, res) => {
  const dosen = await Dosen.findOne({ user: req.userId });
  const list_mhs = await Mahasiswa.find({ kodeWali: dosen._id });
  const list_khs = await Khs.find({});

  let result = [];
  for (let i = 0; i < list_mhs.length; i++) {
    for (let j = 0; j < list_khs.length; j++) {
      // cek tiap khs yang punya nilai mahasiswa == mahasiswa.id
      if (list_mhs[i]._id.equals(list_khs[j].mahasiswa)) {
        let obj_khs = {
          id_khs: list_khs[j]._id,
          name: list_mhs[i].name,
          nim: list_mhs[i].nim,
          angkatan: list_mhs[i].angkatan,
          semester_aktif: list_khs[j].semester_aktif,
          sks: list_khs[j].sks,
          sks_kumulatif: list_khs[j].sks_kumulatif,
          ip: list_khs[j].ip,
          ipk: list_khs[j].ip_kumulatif,
          status_konfirmasi: list_khs[j].status_konfirmasi,
          file: list_khs[j].flie,
        };
        result.push(obj_khs);
      }
    }
  }
  res.status(200).send(result);
};

const verifiedKHS = async (req, res) => {
  const dosen = await Dosen.findOne({ user: req.userId });
  const list_mhs = await Mahasiswa.find({ kodeWali: dosen._id });
  const list_khs = await Khs.find({ status_konfirmasi: "sudah" });

  let result = [];
  for (let i = 0; i < list_mhs.length; i++) {
    for (let j = 0; j < list_khs.length; j++) {
      // cek tiap khs yang punya nilai mahasiswa == mahasiswa.id
      if (list_mhs[i]._id.equals(list_khs[j].mahasiswa)) {
        let obj_khs = {
          id_khs: list_khs[j]._id,
          name: list_mhs[i].name,
          nim: list_mhs[i].nim,
          angkatan: list_mhs[i].angkatan,
          semester_aktif: list_khs[j].semester_aktif,
          sks: list_khs[j].sks,
          sks_kumulatif: list_khs[j].sks_kumulatif,
          ip: list_khs[j].ip,
          ipk: list_khs[j].ip_kumulatif,
          status_konfirmasi: list_khs[j].status_konfirmasi,
          file: list_khs[j].flie,
        };
        result.push(obj_khs);
      }
    }
  }
  res.status(200).send(result);
};

const notVerifiedKHS = async (req, res) => {
  const dosen = await Dosen.findOne({ user: req.userId });
  const list_mhs = await Mahasiswa.find({ kodeWali: dosen._id });
  const list_khs = await Khs.find({ status_konfirmasi: "belum" });

  let result = [];
  for (let i = 0; i < list_mhs.length; i++) {
    for (let j = 0; j < list_khs.length; j++) {
      // cek tiap khs yang punya nilai mahasiswa == mahasiswa.id
      if (list_mhs[i]._id.equals(list_khs[j].mahasiswa)) {
        let obj_khs = {
          id_khs: list_khs[j]._id,
          name: list_mhs[i].name,
          nim: list_mhs[i].nim,
          angkatan: list_mhs[i].angkatan,
          semester_aktif: list_khs[j].semester_aktif,
          sks: list_khs[j].sks,
          sks_kumulatif: list_khs[j].sks_kumulatif,
          ip: list_khs[j].ip,
          ipk: list_khs[j].ip_kumulatif,
          status_konfirmasi: list_khs[j].status_konfirmasi,
          file: list_khs[j].flie,
        };
        result.push(obj_khs);
      }
    }
  }
  res.status(200).send(result);
};

const verifyKHS = async (req, res) => {
  const mhs = await Mahasiswa.findOne({ nim: req.params.nim });
  const dosen = await Dosen.findOne({ user: req.userId });

  if (!dosen._id.equals(mhs.kodeWali)) {
    res.status(403).send(`Anda bukan dosen wali dari ${mhs.name}`);
    return;
  }

  Khs.findOneAndUpdate(
    { mahasiswa: mhs._id, semester_aktif: req.params.semester },
    { status_konfirmasi: "sudah" },
    (err, data) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({ message: "OK" });
    }
  );
};

const deleteAllKHS = (req, res) => {
  Khs.deleteMany({}, (err, data) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(data);
  });
};

module.exports = {
  submitKHS,
  getKHS,
  // Implementasikan fungsi-fungsi lainnya sesuai kebutuhan
};
