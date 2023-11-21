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

exports.generateMahasiswa
