const { IRS, KHS, Mahasiswa } = require("../models");
const sequelize = require("sequelize");
const fs = require('fs').promises;

exports.submitKHS = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const { semester_aktif } = req.body;

    const lastSubmittedKHS = await KHS.findOne({
      where: { mahasiswa_nim: mahasiswa.nim },
      order: sequelize.literal('"semester_aktif"::int DESC'),
    });

    const submittedIRS = await IRS.findOne({
      where: { mahasiswa_nim: mahasiswa.nim, semester_aktif: semester_aktif },
    });

    if (!submittedIRS) {
      return res.status(400).json({ message: "IRS must be submitted first." });
    }

    if (semester_aktif != submittedIRS.semester_aktif) {
      return res.status(400).json({ message: "IRS and KHS must match in semester" });
    }

    const ip = parseFloat(req.body.ip);
    const ipk = lastSubmittedKHS ? parseFloat(lastSubmittedKHS.ip_kumulatif) : 0;
    const sks = parseInt(submittedIRS.sks, 10);
    const sksk = lastSubmittedKHS ? parseInt(lastSubmittedKHS.sks_kumulatif, 10) : 0;


    let existingKHS = await KHS.findOne({
      where: { mahasiswa_nim: mahasiswa.nim, semester_aktif: semester_aktif },
    });

    if (existingKHS) {
      if (req.file && existingKHS.file) {
        await fs.unlink(existingKHS.file);
      }
      existingKHS.file = req.file?.path || existingKHS.file;
      existingKHS.sks = sks;
      existingKHS.sks_kumulatif = sksk + sks;
      existingKHS.ip = ip;
      existingKHS.ip_kumulatif = parseFloat(ipk + ip / semester_aktif);
      await existingKHS.save();

      return res.send({ message: "KHS was updated successfully." });
    }

    const newKHS = {
      mahasiswa_nim: mahasiswa.nim,
      semester_aktif: semester_aktif,
      sks: parseInt(submittedIRS.sks, 10),
      sks_kumulatif: lastSubmittedKHS ? parseInt(lastSubmittedKHS.sks_kumulatif, 10) + parseInt(submittedIRS.sks, 10) : parseInt(submittedIRS.sks, 10),
      ip: parseFloat(ip),
      ip_kumulatif: lastSubmittedKHS ? parseFloat(parseFloat(lastSubmittedKHS.ip_kumulatif) + parseFloat(ip) / semester_aktif) : parseFloat(parseFloat(ip) / semester_aktif),
      file: req.file?.path || null,
    };

    await KHS.create(newKHS);
    console.log(newKHS)
    res.status(201).send({ message: "KHS was created successfully." });

  } catch (err) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


exports.getKHSByMahasiswa = async (req, res) => {
  try {
    const khs = await KHS.findAll({
      where: {
        mahasiswa_nim: req.mahasiswa.nim,
      },
    });

    res.status(200).send(khs);

  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving KHS." });
  }
}

exports.getKHSByDosen = async (req, res) => {
  try {
    const dosen = req.dosen;
    const list_mhs = await Mahasiswa.findAll({ where: { nip_dosen: dosen.nip } });
    const list_khs = await KHS.findAll({ where: { mahasiswa_nim: list_mhs.map(mhs => mhs.nim), status_verifikasi: "belum" } });

    res.status(200).json(list_khs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Some error occurred while retrieving KHS." });
  }
}

exports.getAllKHS = async (req, res) => {
  try {
    const khs = await KHS.findAll();
    res.status(200).send(khs);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving KHS." });
  }
};

exports.showKHS = async (req, res) => {
  try {
    const khs = await KHS.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (!khs) {
      return res.status(404).send({ message: "File not found!" });
    }
    const mhs = await Mahasiswa.findOne({ where: { nim: req.params.nim } });

    const fileStream = fs.createReadStream(khs.file);

    // Set the appropriate content type based on the file type
    const contentType = "application/pdf"; // Sesuaikan berdasarkan jenis file Anda
    res.setHeader("Content-type", contentType);

    // Set Content-Disposition to inline for displaying in a new tab
    res.setHeader("Content-disposition", `inline; filename=KHS_${mhs.nama}_${mhs.nim}_${khs.semester_aktif}.pdf`);

    // Pipe the file stream to the response
    fileStream.pipe(res);
  } catch (err) {
    console.log({ message: err.message || "Error occurred while retrieving KHS." });
  }
};

exports.editKHS = async (req, res) => {
  try {
    const khs = await KHS.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (!khs) {
      return res.status(404).send({ message: "KHS not found!" });
    }

    khs.sks = req.body.sks;
    await khs.save(); // Simpan perubahan ke dalam database

    res.status(200).send({ message: "KHS was updated successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while editing KHS." });
  }
};

exports.verifyKHS = async (req, res) => {
  try {
    const dosen = req.dosen;
    const mhsList = await Mahasiswa.findAll({ where: { nip_dosen: dosen.nip } });
    const mhs = mhsList.find((mhs) => mhs.nim == req.params.nim);

    await KHS.update(
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
    res.status(500).send({ message: err.message || "Some error occurred while updating KHS." });
  }
};

exports.deleteKHS = async (req, res) => {
  try {
    const dosen = req.dosen;
    const mhs = await Mahasiswa.findOne({ where: { nip_dosen: dosen.nip, nim: req.params.nim } });

    if (!mhs) {
      return res.status(404).send({ message: "Mahasiswa not found!" });
    }

    const khs = await KHS.findOne({
      where: {
        mahasiswa_nim: mhs.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (!khs) {
      return res.status(404).send({ message: "KHS not found!" });
    }

    await fs.unlink(khs.file);
    await KHS.destroy({
      where: {
        mahasiswa_nim: mhs.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    res.status(200).send({ message: "KHS was deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while processing the request." });
  }
};