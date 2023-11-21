const db = require("../models");
const Skripsi = db.skripsi;
const Mahasiswa = db.mahasiswa;
const Dosen = db.dosen;
const fs = require("fs");

exports.submitSkripsi = async (req, res) => {
  try {
    const dataSkripsi = {
      nilai: req.body.nilai,
      semester: req.body.semester,
      statusKonfirmasi: "belum",
      mahasiswaId: req.mahasiswaId,
      tanggal: req.body.tanggal,
    };

    if (req.file) {
      dataSkripsi.file = req.file.path;
    }

    const skripsi = await Skripsi.findOne({
      where: { mahasiswaId: dataSkripsi.mahasiswaId },
    });

    if (!skripsi) {
      await Skripsi.create(dataSkripsi);
      res.send({ message: "Skripsi was uploaded successfully!" });
    } else {
      if (req.file) {
        // Delete existing file
        fs.unlink(skripsi.file, (err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          // Update skripsi with new file
          Skripsi.update(
            {
              file: req.file.path,
              nilai: req.body.nilai,
              semester: req.body.semester,
              tanggal: req.body.tanggal,
            },
            { where: { mahasiswaId: dataSkripsi.mahasiswaId } }
          );
        });
      } else {
        // Update skripsi without new file
        Skripsi.update(
          {
            nilai: req.body.nilai,
            semester: req.body.semester,
            tanggal: req.body.tanggal,
          },
          { where: { mahasiswaId: dataSkripsi.mahasiswaId } }
        );
      }

      res.send({ message: "Skripsi was updated successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
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
