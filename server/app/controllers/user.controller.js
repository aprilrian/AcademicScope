const { User, Mahasiswa, Dosen } = require("../models");
const csv = require('csvtojson');
const fs = require('fs');
const multerUpload = require("../services/multer.service");

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

// For OP && Departemen ONLY!
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.create({
      username,
      email,
      password,
      role,
    });
    await user.save();
    res.status(201).send('Akun berhasil disisipkan');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.signupDosen = async (req, res) => {
  try {
    const { nip, nama } = req.body;
    const user = await User.create({
      username: nip,
      password: nip,
      role: "dosen",
    });

    await Dosen.create({
      nip: nip,
      nama: nama,
      user_id: user.id,
    });
    
    res.status(201).send('Akun dosen dengan nama ' + nama + ' berhasil disisipkan');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

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

exports.updateProfil = async (req, res) => {
  try {
    const userData = global.userData;
    const { nama, alamat, kode_kabupatenKota, kode_provinsi, jalur_masuk, email, phone, username } = req.body;

    if (req.file) {
      await Mahasiswa.update({ foto: req.file.filename }, { where: { user_id: userData.id, user_username: userData.username } });
    }
    
    const user = await User.findOne({ where: { id: userData.id, username: userData.username } });
    if (user) {
      User.id = user_id;
      User.username = user_username;
      await Mahasiswa.update(
        {
          nama: nama,
          alamat: alamat,
          kode_kabupatenKota: kode_kabupatenKota,
          kode_provinsi: kode_provinsi,
          jalur_masuk: jalur_masuk,
          email: email,
          phone: phone,
        },
        { where: { user_id: userData.id, user_username: userData.username } }
      );
      await User.update(
        {
          username: username,
          email: email,
        },
        { where: { user_id: userData.id, user_username: userData.username } }
      );
      res.status(200).send('Profile berhasil diperbarui');
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}