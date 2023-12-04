const { SECRET, SECRET_EXP} = require("../configs/auth.config");
const { User, Mahasiswa, Operator, Departemen, Dosen} = require("../models");

//session

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if(!username) {
      return res.status(400).send({ message: "NIP/NIM tidak boleh kosong" });
    }

    let user;
    user = await User.findOne({ where: { username: username } });
    user.isFirstLogin = false;
    
    if (!user) {
      return res.status(404).send({ message: "User tidak ditemukan" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    let userData;

    if (user && user.role === "mahasiswa") {
      // Get mahasiswa name from user.id
      const mahasiswa = await Mahasiswa.findOne({
        where: { user_id: user.id },
      });

      userData = {
        id: user.id,
        username: user.username,
        email: mahasiswa ? mahasiswa.email : null,
        role: user.role,
        nim: mahasiswa ? mahasiswa.nim : null,
        nama: mahasiswa ? mahasiswa.nama : null,
      };
    } else if (user && user.role === "dosen") {
      const dosen = await Dosen.findOne({ where: { user_id: user.id } });

      userData = {
        id: user.id,
        username: user.username,
        email: dosen ? dosen.email : null,
        role: user.role,
        nip: dosen ? dosen.nip : null,
        nama: dosen ? dosen.nama : null,
      };
    } else if (user && user.role === "operator") {
      const operator = await Operator.findOne({ where: { user_id: user.id } });
      
      userData = {
        id: user.id,
        username: user.username,
        email: operator ? operator.email : null,
        role: user.role,
        nip: operator ? operator.nip : null,
        nama: operator ? operator.nama : null,
      };
    } else {
      const departemen = await Departemen.findOne({ where: { user_id: user.id } });

      userData = {
        id: user.id,
        username: user.username,
        email: departemen ? departemen.email : null,
        role: user.role,
        nama: departemen ? departemen.nama : null,
      };
    }

    const token = jwt.sign(userData, SECRET, {
      expiresIn: SECRET_EXP,
    });

    user.access_token = token;
    await user.save();

    res.status(200).send({
      ...userData,
      access_token: token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user = await User.findOne({ where: { access_token: token } });
      
      if (user) {
        userData = null;
        user.access_token = null;
        await user.save();
        res.redirect("/");
      } else {
        return res.status(404).send({ message: "Ditemukan login ilegal. Mengirim agen FBI..." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
};

