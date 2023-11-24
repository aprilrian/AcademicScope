const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const middleware = require("../middlewares/auth.middleware");
const corsConfig = require("../configs/cors.config");

router.use(corsConfig);
router.post("/signin", controller.signin);
router.post("/signout", controller.signout);

module.exports = router;