const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../services/upload.service");

router.get("/all", [authMiddleware.verifyToken],controller.allAccess);
router.get("/operator", [authMiddleware.verifyToken, authMiddleware.isOperator], controller.operatorBoard);
router.get("/mahasiswa", [authMiddleware.verifyToken, authMiddleware.isMahasiswa] ,controller.mahasiswaBoard);
router.get("/dosen", [authMiddleware.verifyToken, authMiddleware.isDosen], controller.dosenBoard);
router.get("/departemen", [authMiddleware.verifyToken, authMiddleware.isDepartemen], controller.departemenBoard);

router.get("/getTemplate", controller.getTemplate)
router.post("/generate", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.generate);
router.post("/generateBatch", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.generateBatch);
router.post("/updateProfil", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, upload],
  controller.updateProfil);

module.exports = router;