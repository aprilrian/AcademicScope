const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../services/upload.service");

router.get("/allAccess", controller.allAccess);
router.get("/operatorBoard", controller.operatorBoard);
router.get("/mahasiswaBoard", controller.mahasiswaBoard);
router.get("/dosenBoard", controller.dosenBoard);
router.get("/departemenBoard", controller.departemenBoard);

router.get("/getTemplate", controller.getTemplate)
router.post("/generate", 
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  controller.generate);
router.post("/generateBatch", 
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  controller.generateBatch);
router.post("/updateProfil", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, upload],
  controller.updateProfil);

module.exports = router;