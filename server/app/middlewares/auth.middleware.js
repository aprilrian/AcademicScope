const { ACC_SECRET, REF_SECRET} = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const db = require("../models");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, ACC_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}

function generateAccessToken(user) {
  return jwt.sign(user, ACC_SECRET, { expiresIn: '300s' })
}

authMiddleware = {
    authenticateToken,
    generateAccessToken,
};

module.exports = authMiddleware;