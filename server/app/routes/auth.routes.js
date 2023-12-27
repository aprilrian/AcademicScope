const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const userMiddleware = require("../middlewares/user.middleware");

router.post("/signin", controller.signin);
router.post("/signout", controller.signout);

module.exports = router;