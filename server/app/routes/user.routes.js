const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require("../middlewares/user.middleware");
const upload = require("../services/upload.service");

router.get("/", [authMiddleware.verifyToken, userMiddleware.hasUpdateProfile],controller.allAccess);
router.get("/operator", [authMiddleware.verifyToken, authMiddleware.isOperator], controller.operatorBoard);
router.get("/mahasiswa", [authMiddleware.verifyToken, authMiddleware.isMahasiswa] ,controller.mahasiswaBoard);
router.get("/dosen", [authMiddleware.verifyToken, authMiddleware.isDosen], controller.dosenBoard);
router.get("/departemen", [authMiddleware.verifyToken, authMiddleware.isDepartemen], controller.departemenBoard);

// OPERATOR
router.post("/operator/generate", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.generate);
router.post("/operator/generateBatch", 
  [authMiddleware.verifyToken, authMiddleware.isOperator],
  controller.generateBatch);

// MAHASISWA
router.post("/mahasiswa/updateMahasiswa", 
  [authMiddleware.verifyToken, authMiddleware.isMahasiswa, upload],
  controller.updateMahasiswa);
router.use("/mahasiswa/irs", require("./irs.routes"));
router.use("/mahasiswa/khs", require("./khs.routes")); 
router.use("/mahasiswa/pkl", require("./pkl.routes"));
router.use("/mahasiswa/skripsi", require("./skripsi.routes"));

// DOSEN

// DEPARTEMEN

module.exports = router;