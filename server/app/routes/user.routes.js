const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const corsConfig = require("../configs/cors.config");
const authMiddleware = require("../middlewares/auth.middleware");
const multerUpload = require("../services/multer.service");

router.use(corsConfig);
router.post("/signupDosen", controller.signupDosen);
router.post("/generate", 
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  controller.generate);
router.post("/generateBatch", 
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  controller.generateBatch);

module.exports = router;