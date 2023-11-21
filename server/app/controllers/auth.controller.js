// const { ACC_SECRET, REF_SECRET, ACC_EXP, REF_EXP} = require("../configs/auth.config.js");
// const jwt = require("jsonwebtoken");
// const { User } = require("../models");
// const bcrypt = require("bcrypt");

// exports.signIn = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       where: {
//         username: req.body.username
//       }
//     });

//     if (!user) {
//       return res.status(404).send({ message: "User Not found." });
//     }

//     const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

//     if (!passwordIsValid) {
//       return res.status(401).send({
//         accessToken: null,
//         message: "Invalid Password!"
//       });
//     }

//     // Generate access token
//     const accessToken = jwt.sign({ id: user.id }, ACC_SECRET, {
//       expiresIn: ACC_EXP || '1h' // Set expiration, default 1 hour
//     });

//     // Generate refresh token
//     const refreshToken = jwt.sign({ id: user.id }, REF_SECRET, {
//       expiresIn: REF_EXP || '7d' // Set expiration, default 7 days
//     });

//     // Set refresh token in the user table (optional, you can store it wherever you prefer)
//     user.refreshToken = refreshToken;
//     await user.save();

//     // Set the access token as a cookie
//     res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: ACC_EXP || 3600000 }); // Set maxAge, default 1 hour

//     // Optionally, you can also set the refresh token as a cookie if needed
//     // res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: REFRESH_TOKEN_EXPIRATION || 604800000 }); // Set maxAge, default 7 days

//     res.status(200).send({
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       accessToken: accessToken,
//       refreshToken: refreshToken
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: err.message });
//   }
// };


// exports.signout = (req, res) => {
//   // Clear the access token cookie
//   res.clearCookie('accessToken');

//   // Optionally, clear the refresh token cookie if used
//   // res.clearCookie('refreshToken');

//   res.status(200).send({ accessToken: null, message: "Logout berhasil" });
// };

const SECRET = process.env.SECRET;
const { User, Mahasiswa, Dosen} = require("../models");

//session

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let user;

    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (username) {
      user = await User.findOne({ where: { username } });
    } else {
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
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

    if (user && user.role.name === "mahasiswa") {
      // Get mahasiswa name from user.id
      const mahasiswa = await Mahasiswa.findOne({
        where: { userId: user.id },
      });

      userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.role.name,
        name: mahasiswa ? mahasiswa.name : null,
      };
    } else if (user && user.role.name === "dosen") {
      const dosen = await Dosen.findOne({ where: { userId: user.id } });

      userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.role.name,
        name: dosen ? dosen.name : null,
      };
    } else {
      userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.role.name,
      };
    }

    const token = jwt.sign(userData, process.env.SECRET, {
      expiresIn: "12h",
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
  req.session.save(function (err) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect("/");
    });
  });
};
