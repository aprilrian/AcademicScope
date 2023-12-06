const { IRS, Skripsi, Mahasiswa, Dosen } = require("../models");
const fs = require("fs").promises;
const sequelize = require("sequelize");

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
        semester_aktif: semester,
      },
      order: sequelize.literal('"semester_aktif"::int DESC'),
    });

    if (status == "belum ambil") {
      return res.status(400).send({ message: "You are not eligible to submit Skripsi" });
    }

    if (findSkripsi) {
      if (req.file) {
        await fs.unlink(req.file.path);
      res.send({ message: "Your skripsi is already exists!" });
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

      res.status(201).send({ message: "Skripsi was created successfully." });
      }
    }
  } catch (err) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting uploaded file:", unlinkError);
      }
    }
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred while creating the Skripsi." });
  }
};

exports.getSkripsi = async (req, res) => {
  try {
    const skripsi = await Skripsi.findOne({
      where: { mahasiswaId: req.mahasiswaId },
    });

    if (!skripsi) {
      res.status(404).send({ message: "Skripsi not found!" });
      return;
    }

    let filename = skripsi.file.split("/").pop();
    filename = filename.split("-").slice(1).join("-");

    let tanggal = new Date(skripsi.tanggal);
    tanggal = tanggal.toLocaleDateString("id-ID");

    res.status(200).send({
      nilai: skripsi.nilai,
      tanggal: tanggal,
      semester: skripsi.semester,
      status_konfirmasi: skripsi.statusKonfirmasi,
      file: filename,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getRekap = async (req, res) => {
  try {
    const resultMhs = await Mahasiswa.findAll();
    const resultSkr = await Skripsi.findAll();

    let result = resultMhs.map((mhs) => {
      const skripsi = resultSkr.find((skr) => skr.mahasiswaId === mhs.id);

      if (skripsi) {
        return {
          name: mhs.name,
          nim: mhs.nim,
          angkatan: mhs.angkatan,
          status_konfirmasi: "sudah",
        };
      } else {
        return {
          name: mhs.name,
          nim: mhs.nim,
          angkatan: mhs.angkatan,
          status_konfirmasi: "belum",
        };
      }
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.downloadSkripsi = async (req, res) => {
  try {
    const skripsi = await Skripsi.findOne({
      where: { mahasiswaId: req.mahasiswaId },
    });

    if (!skripsi) {
      res.status(404).send({ message: "File not found!" });
      return;
    }

    const file = fs.createReadStream(skripsi.file);
    const filename = "Skripsi";
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    file.pipe(res);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.waliSkripsi = async (req, res) => {
  try {
    const dosen = await Dosen.findOne({ where: { user: req.userId } });
    const resultMhs = await Mahasiswa.findAll({ where: { kodeWali: dosen.id } });
    const resultSkr = await Skripsi.findAll();

    let result = resultMhs.map((mhs) => {
      const skripsi = resultSkr.find((skr) => skr.mahasiswaId === mhs.id);

      if (skripsi) {
        return {
          name: mhs.name,
          nim: mhs.nim,
          angkatan: mhs.angkatan,
          status_konfirmasi: "sudah",
        };
      } else {
        return {
          name: mhs.name,
          nim: mhs.nim,
          angkatan: mhs.angkatan,
          status_konfirmasi: "belum",
        };
      }
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
