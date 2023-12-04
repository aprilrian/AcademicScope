const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const {authMiddleware, userMiddleware} = require("../middlewares");
const upload = require("../services/upload.service");

router.get("/", 
  [authMiddleware.verifyToken],
  controller.allAccess);
router.get("/operator", 
  [authMiddleware.verifyToken, authMiddleware.isOperator], 
  controller.operatorBoard);
router.get("/mahasiswa", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID ,userMiddleware.hasUpdateProfile], 
  controller.mahasiswaBoard);
router.get("/dosen", 
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID ,userMiddleware.hasUpdateProfile], 
  controller.dosenBoard);
router.get("/departemen", 
  [authMiddleware.verifyToken, authMiddleware.isDepartemen], 
  controller.departemenBoard);

// OPERATOR
router.post("/operator/generate", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.generate);
router.post("/operator/generateBatch", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.generateBatch);
router.get("/getBatchTemplate", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.getBatchTemplate)

// MAHASISWA
router.post("/mahasiswa/updateProfile", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, upload],
  controller.updateMahasiswa);
router.use("/mahasiswa/irs", require("./irs.routes"));
// router.use("/mahasiswa/khs", require("./khs.routes")); 
// router.use("/mahasiswa/pkl", require("./pkl.routes"));
// router.use("/mahasiswa/skripsi", require("./skripsi.routes"));

// DOSEN
router.post("/dosen/updateProfile", 
  [authMiddleware.verifyToken, authMiddleware.isDosen, upload],
  controller.updateDosen);
router.get('/getAllMahasiswaByDosen', 
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID ,userMiddleware.hasUpdateProfile],
  controller.getAllMahasiswaByDosen);

// DEPARTEMEN x OPERATOR
router.get('/getAllDosen', 
  [authMiddleware.verifyToken, authMiddleware.isMaster],
  controller.getAllDosen);
router.get('/getAllMahasiswa', 
  [authMiddleware.verifyToken, authMiddleware.isMaster],
  controller.getAllMahasiswa);

module.exports = router;