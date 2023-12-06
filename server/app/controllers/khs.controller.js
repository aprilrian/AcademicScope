const { IRS, KHS, Mahasiswa } = require("../models");
const sequelize = require("sequelize");
const fs = require('fs').promises;

exports.submitKHS = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const { semester_aktif, ip } = req.body;

    const khs = await KHS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        semester_aktif: semester_aktif,
      },
    });

    const lastKHS = await KHS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
      },
      order: sequelize.literal('"semester_aktif"::int DESC'),
    });

    if (khs) {
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (err) {
          console.log(err);
        }
      }
      return res.status(400).send({ message: "KHS already exists!" });
    }

    const irs = await IRS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        semester_aktif: semester_aktif,
      },
    });

    if (!irs) {
      return res.status(404).send({ message: "IRS must be submitted first!" });
    }

    if (semester_aktif != irs.semester_aktif) {
      return res.status(400).send({ message: "IRS and KHS semester must be the same!" });
    }

    await KHS.create({
      mahasiswa_nim: mahasiswa.nim,
      semester_aktif: semester_aktif,
      sks: irs.sks,
      sks_kumulatif: lastKHS ? parseInt(lastKHS.sks_kumulatif, 10) + parseInt(irs.sks, 10) : irs.sks,
      ip: parseFloat(ip).toFixed(2),
      ip_kumulatif: lastKHS ? parseFloat((parseFloat(lastKHS.ip_kumulatif) + parseFloat(ip)) / 2).toFixed(2) : parseFloat(ip).toFixed(2),
      file: req.file.path,
    });

    res.status(200).send("KHS was submitted successfully!");
  } catch (err) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while submitting KHS." });
  }
}

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

exports.getKHSBelumByDosen = async (req, res) => {
  try {
    const dosen = req.dosen;
    const list_khs = await KHS.findAll({
      where: { status_verifikasi: "belum" },
      include: [
        {
          model: Mahasiswa,
          attributes: ["nama", "angkatan"],
          where: { nip_dosen: dosen.nip },
          as: "Mahasiswa",
        },
      ],
    });

    const transformedListKHS = list_khs.map(khs => ({
      id: khs.id,
      nama: khs.Mahasiswa?.nama || null,
      mahasiswa_nim: khs.mahasiswa_nim,
      angkatan: khs.Mahasiswa?.angkatan || null,
      semester_aktif: khs.semester_aktif,
      sks: khs.sks,
      sks_kumulatif: khs.sks_kumulatif,
      ip: khs.ip,
      ip_kumulatif: khs.ip_kumulatif,
      file: khs.file,
      status_verifikasi: khs.status_verifikasi,
      createdAt: khs.createdAt,
      updatedAt: khs.updatedAt,
    }));

    res.status(200).json(transformedListKHS);
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