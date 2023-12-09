const { IRS, Mahasiswa } = require("../models");
const fs = require("fs").promises;
const sequelize = require("sequelize");

exports.submitIRS = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;

    const lastSubmittedIRS = await IRS.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
      },
      order: sequelize.literal('"semester_aktif"::int DESC'),
    });

    if (lastSubmittedIRS) {
      if (req.body.semester_aktif <= lastSubmittedIRS.semester_aktif + 1) {
        console.log(lastSubmittedIRS)
        return res.status(400).json({ message: "IRS semester must be sequential." });
      }
    }

    if (!lastSubmittedIRS) {
      if (req.body.semester_aktif != 1) {
        return res.status(400).json({ message: "IRS semester must be started from 1." });
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
        try {
          await fs.unlink(req.file.path);
        } catch (err) {
          console.log(err);
        }
      }
      return res.status(400).send({ message: "IRS already exists!"})
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
    console.error(req.file);
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

exports.getIRSBelumByDosen = async (req, res) => {
  try {
    const dosen = req.dosen;
    const list_irs = await IRS.findAll({
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

    const transformedListIRS = list_irs.map(irs => ({
      id: irs.id,
      nama: irs.Mahasiswa?.nama || null,
      angkatan: irs.Mahasiswa?.angkatan || null,
      mahasiswa_nim: irs.mahasiswa_nim,
      semester_aktif: irs.semester_aktif,
      sks: irs.sks,
      file: irs.file,
      status_verifikasi: irs.status_verifikasi,
      createdAt: irs.createdAt,
      updatedAt: irs.updatedAt,
    }));

    res.status(200).json(transformedListIRS);
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

exports.getIRSBySemesterAndMahasiswa = async (req, res) => { 
  try {
    const irs = await IRS.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (!irs) {
      return res.status(404).send({ message: "IRS not found!" });
    }

    res.status(200).send(irs);
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving IRS." });
  }
};

exports.showIRS = async (req, res) => {
  try {
    const irs = await IRS.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (!irs) {
      return res.status(404).send({ message: "File not found!" });
    }
    const mhs = await Mahasiswa.findOne({ where: { nim: req.params.nim } });

    const fileStream = fs.createReadStream(irs.file);

    // Set the appropriate content type based on the file type
    const contentType = "application/pdf"; // Sesuaikan berdasarkan jenis file Anda
    res.setHeader("Content-type", contentType);

    // Set Content-Disposition to inline for displaying in a new tab
    res.setHeader("Content-disposition", `inline; filename=IRS_${mhs.nama}_${mhs.nim}_${irs.semester_aktif}.pdf`);

    // Pipe the file stream to the response
    fileStream.pipe(res);
  } catch (err) {
    console.log({ message: err.message || "Error occurred while retrieving IRS." });
  }
};

exports.editIRS = async (req, res) => {
  try {
    const irs = await IRS.findOne({
      where: {
        mahasiswa_nim: req.params.nim,
        semester_aktif: req.params.semester_aktif,
      },
    });

    if (irs.status_verifikasi == "sudah") {
      return res.status(400).send({ message: "IRS has been verified" });
    }

    if (!irs) {
      return res.status(404).send({ message: "IRS not found!" });
    }

    irs.sks = req.body.sks;
    await irs.save();

    res.status(200).send({ message: "IRS was updated successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Some error occurred while editing IRS." });
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

    res.status(200).send({ message: "IRS was verified successfully." });
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