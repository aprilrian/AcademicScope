const { User, Mahasiswa, Dosen } = require("../models");
const csv = require('csvtojson');
const fs = require('fs');
const bcrypt = require('bcryptjs');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
}

exports.operatorBoard = (req, res) => {
  res.status(200).send("Operator Content.");
}

exports.mahasiswaBoard = (req, res) => {
  res.status(200).send("Mahasiswa Content.");
}

exports.dosenBoard = (req, res) => {
  res.status(200).send("Dosen Content.");
}

exports.departemenBoard = (req, res) => {
  res.status(200).send("Departemen Content.");
}

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 8);
    await User.update({ password: passwordHash }, { where: { id: req.user_id } });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// OPERATOR
exports.generate = async (req, res) => {
  try {
    const { nim, nama, angkatan, nip_dosen } = req.body;
    
    const user = await User.create({
      username: nim,
      password: nim,
      role: "mahasiswa",
    });

    await Mahasiswa.create({
      nim: nim,
      nama: nama,
      angkatan: angkatan,
      status: "aktif",
      nip_dosen: nip_dosen,
      user_id: user.id,
    });
    res.status(201).send('Akun mahasiswa dengan nama ' + nama + ' berhasil disisipkan');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getBatchTemplate = async (req, res) => {
  try {
    const template = './uploads/template.csv'
    res.download(template);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.generateBatch = async (req, res) => {
  try {
    const jsonFile = await csv().fromFile(req.file.path, { delimiter: ',' });

    const createdAccounts = [];

    await User.sequelize.transaction(async (t) => {
      for (const row of jsonFile) {
        const user = await User.create({
          username: row.nim,
          password: row.nim,
          role: "mahasiswa",
        }, 
        { transaction: t }
        );

        await Mahasiswa.create({
          nim: row.nim,
          nama: row.nama,
          angkatan: row.angkatan,
          status: "aktif",
          nip_dosen: row.nip_dosen,
          user_id: user.id,
        }, 
        { transaction: t }
        );
        
        createdAccounts.push('Akun mahasiswa dengan nama ' + row.nama + ' berhasil disisipkan');
      }
    })

    fs.unlinkSync(req.file.path);
    const responseMessage = createdAccounts.join('\n');
    res.status(201).send(responseMessage);

  } catch (error) {
    console.log(error);
    fs.unlinkSync(req.file.path);
    res.status(500).send({
      message: error.message,
    });
  }
};

// DEPARTEMEN

// DOSEN
exports.updateDosen = async (req, res) => {
  try {
    const t = await User.sequelize.transaction();
    const { alamat, phone } = req.body;

    const user = await User.findOne({ where: { id: req.user_id }, transaction: t });
    if (user) {
      this.changePassword(req, res);
      if (req.file) {
        await Dosen.update({ foto: req.file.path }, { where: { user_id: req.user_id } });
      }
      await Dosen.update(
        {
          alamat: alamat,
          phone: phone,
        },
        { where: { user_id: req.user_id }, transaction: t }
      );
    }
    await t.commit();
    res.status(200).send('Profile berhasil diperbarui');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllDosen = async (req, res) => {
  try {
    const dosen = await Dosen.findAll();
    res.status(200).send(dosen);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// MAHASISWA
exports.updateMahasiswa = async (req, res) => {
  try {
    const t = await User.sequelize.transaction();
    const { alamat, kode_kabupatenKota, kode_provinsi, jalur_masuk, email, phone, foto } = req.body;

    const user = await User.findOne({ where: { id: req.user_id }, transaction: t });
    if (user) {
      this.changePassword(req, res);
      if (req.file) {
        await Mahasiswa.update({ foto: req.file.path }, { where: { user_id: req.user_id } });
      }
      await Mahasiswa.update(
        {
          alamat: alamat,
          kode_kabupatenKota: kode_kabupatenKota,
          kode_provinsi: kode_provinsi,
          jalur_masuk: jalur_masuk,
          email: email,
          phone: phone,
          foto: foto,
        },
        { where: { user_id: req.user_id }, transaction: t }
      );
    }
    await t.commit();
    res.status(200).send('Profile berhasil diperbarui');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findAll();
    res.status(200).send(mahasiswa);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllMahasiswaByDosen = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findAll({ where: { nip_dosen: req.dosen.nip } });
    res.status(200).send(mahasiswa);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}