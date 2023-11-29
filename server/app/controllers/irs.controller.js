const { IRS, Mahasiswa, Dosen } = require("../models");
const fs = require("fs").promises;

const submitIRS = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({ user: req.user_id });
    const [IRS, created] = await mahasiswa.createIRS({
      semester_aktif: req.body.semester_aktif,
      sks: req.body.sks,
      status_verifikasi: "belum",
    });

    if (created) {
      if (req.file) {
        IRS.file = req.file.path;
        await IRS.save();
      }
      res.send({ message: "IRS was uploaded successfully!" });

    } else {
      if (req.file) {
        if (irs.file) {
          await fs.unlink(irs.file);
        }
        IRS.file = req.file.path;
      }
      IRS.semester_aktif = req.body.semester_aktif;
      IRS.sks = req.body.sks;
      IRS.status_verifikasi = "belum";
      await IRS.save();

      res.send({ message: "IRS was updated successfully!" });
    }
  } catch (err) {
    fs.unlink(req.file.path);
    console.error(err);
    res.status(500).send({ message: err.message || "Some error occurred." });
  }
};


const getIRS = (req, res) => {
  IRS.findAll({
    where: {
      mahasiswaId: req.mahasiswaId,
    },
  })
    .then((data) => {
      let list_obj = [];
      data.forEach((irs) => {
        let filename = irs.file.split("\\").pop().split("/").pop();
        filename = filename.split("-").slice(1).join("-");
        const newObj = {
          semester_aktif: irs.semesterAktif,
          sks: irs.sks,
          status_konfirmasi: irs.statusKonfirmasi,
          file: filename,
        };
        list_obj.push(newObj);
      });
      res.status(200).send(list_obj);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving IRS." });
    });
};

const getAllIRS = async (req, res) => {
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
const downloadIRS = (req, res) => {
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

const waliIRS = async (req, res) => {
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

const verifyIRS = async (req, res) => {
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

const deleteAllIRS = (req, res) => {
  IRS.destroy({ truncate: true })
    .then(() => {
      res.status(200).send({ message: "All IRS records were deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred while deleting IRS records." });
    });
};

module.exports = {
  verifyIRS,
  waliIRS,
  submitIRS,
  getIRS,
  getAllIRS,
  downloadIRS,
  deleteAllIRS,
};


// // Entry Pengambilan IRS per Semester (SRS-XXX-003)
// app.post('/irs', authenticateToken, async (req, res) => {
//   const { id, semester, mata_kuliah, sks, nim } = req.body;
//   const username = req.user.username;

//   try {
//     // Simpan data IRS ke database
//     await db.query(`
//       INSERT INTO public.irs (id, semester, mata_kuliah, sks, nim)
//       VALUES ($1, $2, $3, $4, $5)
//     `, [id, semester, mata_kuliah, sks, nim]);

//     res.status(201).json({ message: 'Data IRS berhasil disimpan' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Gagal menyimpan data IRS' });
//   }
// });

// // Verifikasi progress studi
// app.put('/verifikasiprogress', authenticateToken, async (req, res) => {
//     const { id, status_konfirmasi } = req.body;
  
//     try {
//       // Update status konfirmasi progress studi
//       await db.query(`
//         UPDATE public.irs SET status_konfirmasi = $1 WHERE id = $2
//       `, [status_konfirmasi, id]);
  
//       res.status(200).json({ message: 'Verifikasi progress studi berhasil' });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ error: 'Gagal verifikasi progress studi' });
//     }
//   });