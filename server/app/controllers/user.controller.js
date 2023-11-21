const { User, Role, Mahasiswa, Dosen } = require("../models");
const bcrypt = require('bcrypt');
const fs = require('fs');
const csv = require('csvtojson');

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

exports.generate = async (req, res) => {
  try {
    if (req.body.nim) {
      const nim = req.body.nim;
      const user = await User.findOne({ where: { username: nim } });
      if (user) {
        res.status(500).send({ message: 'NIM sudah terdaftar' });
      } else {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(nim, salt);
        const role = await Role.findOne({ where: { name: 'mahasiswa' } });
        const mahasiswa = await Mahasiswa.findOne({ where: { nim } });
        const user = await User.create({
          username: nim,
          password,
          role_id: role.id,
          mahasiswa_id: mahasiswa.id,
        });
        await user.save();
        res.status(201).send('Akun berhasil disisipkan');
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
