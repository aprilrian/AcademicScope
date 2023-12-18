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
  controller.dashboardOperator);
router.get("/mahasiswa", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID ,userMiddleware.hasUpdateProfile], 
  controller.dashboardMahasiswa);
router.get("/dosen", 
  // [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID ,userMiddleware.hasUpdateProfile], 
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID], 
  controller.dashboardDosen);
router.get("/departemen", 
  [authMiddleware.verifyToken, authMiddleware.isDepartemen], 
  controller.dashboardDepartemen);
router.get("/profileDetail",
  [authMiddleware.verifyToken],
  controller.viewProfile)
router.get("/detail/:id",
  [authMiddleware.verifyToken],
  controller.viewProfile)

// OPERATOR
router.post("/operator/generate", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.generate);
router.post("/operator/generateBatch", 
  [authMiddleware.verifyToken, authMiddleware.isOperator, upload],
  controller.generateBatch);
router.get("/operator/getBatchTemplate", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.getBatchTemplate)
router.get("/operator/getAllAccount",
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.getAllAccount);

// MAHASISWA
router.get('/mahasiswa/ipkGraphMahasiswaBoard',
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID ,userMiddleware.hasUpdateProfile],
  controller.ipkGraphMahasiswaBoard);
router.post("/mahasiswa/updateProfile", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, upload],
  controller.updateMahasiswa);
router.use("/mahasiswa/irs", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID ,userMiddleware.hasUpdateProfile],
  require("./irs.routes"));
router.use("/mahasiswa/khs", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID ,userMiddleware.hasUpdateProfile],
  require("./khs.routes")); 
router.use("/mahasiswa/pkl", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID ,userMiddleware.hasUpdateProfile],
  require("./pkl.routes"));
router.use("/mahasiswa/skripsi", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID ,userMiddleware.hasUpdateProfile],
  require("./skripsi.routes"));

// DOSEN
router.get('/dosen/ipkGraphDosenBoard',
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID],
  controller.ipkGraphDosenBoard);
router.post("/dosen/updateProfile", 
  [authMiddleware.verifyToken, authMiddleware.isDosen, upload],
  controller.updateDosen);
router.get('/dosen/getAllMahasiswaByDosen', 
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID],
  controller.getAllMahasiswaByDosen);
router.use("/dosen/irs", 
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID],
  require("./irs.routes"));
router.use("/dosen/khs",
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID],
  require("./khs.routes"));
router.use("/dosen/pkl",
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID],
  require("./pkl.routes"));
router.use("/dosen/skripsi",
  [authMiddleware.verifyToken, authMiddleware.isDosen, userMiddleware.getDosenByID],
  require("./skripsi.routes"));

// DEPARTEMEN
router.use('/departemen/irs',
  [authMiddleware.verifyToken, authMiddleware.isDepartemen],
  require("./irs.routes"));
router.use('/departemen/khs',
  [authMiddleware.verifyToken, authMiddleware.isDepartemen],
  require("./khs.routes"));
router.use('/departemen/pkl',
  [authMiddleware.verifyToken, authMiddleware.isDepartemen],
  require("./pkl.routes"));
router.use("/departemen/skripsi",
  [authMiddleware.verifyToken, authMiddleware.isDepartemen, userMiddleware.getMasterByID],
  require("./skripsi.routes"))
router.get('/departemen/mahasiswaCount',
  [authMiddleware.verifyToken, authMiddleware.isDepartemen],
  controller.getAllMahasiswaCount);

// DEPARTEMEN x OPERATOR = MASTER
router.get('/master/getAllDosen', 
  [authMiddleware.verifyToken, authMiddleware.isMaster],
  controller.getAllDosen);
router.get('/master/getAllMahasiswa', 
  [authMiddleware.verifyToken, authMiddleware.isMaster],
  controller.getAllMahasiswa);

module.exports = router;