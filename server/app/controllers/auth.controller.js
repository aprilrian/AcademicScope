const { SECRET, SECRET_EXP} = require("../configs/auth.config");
const { User, Mahasiswa, Dosen} = require("../models");

//session

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// For OP ONLY!
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (user.role === "admin") {
      const user = await User.create({
        username,
        email,
        password,
        role,
      });
      await user.save();
      res.status(201).send('Akun berhasil disisipkan');
    } else {
      res.status(403).send('Anda tidak memiliki akses');
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ where: { username } });
    
    if(!username) {
      return res.status(400).send({ message: "Username tidak boleh kosong" });
    }

    if (!user) {
      return res.status(404).send({ message: "User tidak ditemukan." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // check if session is already set if yes then respond with 200
    if (req.session.user) {
      return res.status(200).send({
        message: "User already logged in",
      });
    } else {
      // set session
      req.session.user = user.username;
      req.session.save(function (err) {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    }

    let userData;

    if (user && user.role === "mahasiswa") {
      // Get mahasiswa name from user.id
      const mahasiswa = await Mahasiswa.findOne({
        where: { userId: user.id },
      });

      userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: mahasiswa ? mahasiswa.name : null,
      };
    } else if (user && user.role === "dosen") {
      const dosen = await Dosen.findOne({ where: { userId: user.id } });

      userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.role,
        name: dosen ? dosen.name : null,
      };
    } else {
      userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    }

    const token = jwt.sign(userData, SECRET, {
      expiresIn: SECRET_EXP,
    });

    res.status(200).send({
      ...userData,
      accessToken: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

exports.signout = (req, res) => {
  req.session.user = null;
  req.session.regenerate((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error regenerating session' });
    }

    res.redirect("/");
  });
};

