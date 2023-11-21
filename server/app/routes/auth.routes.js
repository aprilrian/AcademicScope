const express = require('express');
const router = express.Router();
// const authMiddleware = require("../middlewares/auth.middleware.js");
const controller = require("../controllers/auth.controller.js");

router.post('/signin', controller.signIn);
router.post('/signout', (res) => {
  res.clearCookie('accessToken');
  res.status(200).send({ message: 'Signed out' });
});

module.exports = router;