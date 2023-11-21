const { ACC_SECRET, REF_SECRET} = require("../configs/auth.config.js");
const jwt = require("jsonwebtoken");
const db = require("../models");

exports.authenticateToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).send({ message: "No token provided!" });
    }

    jwt.verify(accessToken, ACC_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

authMiddleware = {
    authenticateToken,
};

module.exports = authMiddleware;