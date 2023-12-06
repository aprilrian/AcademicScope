const { Skripsi, Mahasiswa, Dosen } = require("../models");
const fs = require("fs");

exports.submitSkripsi = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const { status, nilai, semester, tanggal_lulus, tanggal_sidang } = req.body;

    let findSkripsi = await Skripsi.findOne({
      where: {
        mahasiswa_nim: mahasiswa.nim,
        status: req.body.status,
      },
    });

    if (skripsi) {
      if (req.file) {
        await fs.unlink(skripsi.file);

      res.send({ message: "Skripsi was updated successfully." });
    } else {
      const newSkripsi = {
        status: req.body.status,
        nilai: req.body.nilai,
        semester: req.body.semester,
        status_verifikasi: "sedang diverifikasi",
        tanggal_lulus: req.body.tanggal_lulus,
        tanggal_sidang: req.body.tanggal_sidang,
        lama_studi: req.body.lama_studi,
        file: req.file.path,
        mahasiswa_nim: mahasiswa.nim,
      };

      await Skripsi.create(newSkripsi);

      res.status(201).send({ message: "Skripsi was created successfully." });
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
