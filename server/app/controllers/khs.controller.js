const { IRS, KHS, Mahasiswa } = require("../models");
const fs = require("fs");

exports.submitKHS = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;

    const lastSubmittedKHS = await KHS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
      },
      order: [["semester_aktif", "DESC"]],
    });

    const lastSubmittedIRS = await IRS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        semester_aktif: req.body.semester_aktif,
      },
    });
    console.log(lastSubmittedIRS);

    if (!lastSubmittedIRS) {
      return res.status(400).json({ message: "IRS must be submitted first." });
    } else {
      if (req.body.semester_aktif != lastSubmittedIRS.semester_aktif) {
        return res.status(400).json({ message: "IRS and KHS must be submitted in the same semester." });
      }

      if (req.body.sks != lastSubmittedIRS.sks) {
        return res.status(400).json({ message: "IRS and KHS must have the same SKS." });
      }
  
      let existingKHS = await KHS.findOne({
        where: {
          mahasiswa_nim: mahasiswa.nim,
          semester_aktif: req.body.semester_aktif,
        },
      });
  
      if (existingKHS) {
        if (req.file) {
          if (existingKHS.file) {
            await fs.unlink(existingKHS.file);
          }
          existingKHS.file = req.file.path;
        }
        existingKHS.sks = lastSubmittedIRS.sks;
        existingKHS.sks_kumulatif = (lastSubmittedKHS ? lastSubmittedKHS.sks_kumulatif : 0) + lastSubmittedIRS.sks;
        existingKHS.ip = req.body.ip;
        existingKHS.ip_kumulatif = ((lastSubmittedKHS ? lastSubmittedKHS.ip_kumulatif : 0) + req.body.ip) / req.body.semester_aktif;
        await existingKHS.save();
  
        return res.send({ message: "KHS was updated successfully." });
      }
  
      const newKHS = {
        mahasiswa_nim: mahasiswa.nim,
        semester_aktif: req.body.semester_aktif,
        sks: lastSubmittedIRS.sks,
        sks_kumulatif: (lastSubmittedKHS ? lastSubmittedKHS.sks_kumulatif : 0) + lastSubmittedIRS.sks,
        ip: req.body.ip,
        ip_kumulatif: ((lastSubmittedKHS ? lastSubmittedKHS.ip_kumulatif : 0) + req.body.ip) / req.body.semester_aktif,
        file: req.file.path,
      };
      await KHS.create(newKHS);
  
      res.status(201).send({ message: "KHS was created successfully." });
    }

  } catch (err) {
    // if (req.file) {
    //   await fs.unlink(req.file.path);
    // }
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