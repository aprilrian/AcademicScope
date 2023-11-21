const { ACC_SECRET, REF_SECRET} = require("../configs/auth.config.js");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    // Generate access token
    const accessToken = jwt.sign({ id: user.id }, ACC_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRATION || '1h' // Set expiration, default 1 hour
    });

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user.id }, REF_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION || '7d' // Set expiration, default 7 days
    });

    // Set refresh token in the user table (optional, you can store it wherever you prefer)
    user.refreshToken = refreshToken;
    await user.save();

    // Set the access token as a cookie
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: ACCESS_TOKEN_EXPIRATION || 3600000 }); // Set maxAge, default 1 hour

    // Optionally, you can also set the refresh token as a cookie if needed
    // res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: REFRESH_TOKEN_EXPIRATION || 604800000 }); // Set maxAge, default 7 days

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};


exports.signout = (req, res) => {
  // Clear the access token cookie
  res.clearCookie('accessToken');

  // Optionally, clear the refresh token cookie if used
  // res.clearCookie('refreshToken');

  res.status(200).send({ accessToken: null, message: "Logout berhasil" });
};
