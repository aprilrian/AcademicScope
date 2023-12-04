const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const kabupatenKotaController = require('../controllers/kabupatenKota.controller');
const provinsiController = require('../controllers/provinsi.controller');

// Kabupaten Kota
router.get('/getKabupatenKota', kabupatenKotaController.getAll);
router.get('/kabupatenKota/:kode_provinsi', kabupatenKotaController.getAllByProvinsi);

// Provinsi
router.get('/getAllProvinsi', provinsiController.getAll);

// User
router.get('/getAllDosen', userController.getAllDosen);
router.get("/getBatchTemplate", userController.getBatchTemplate)

// Mahasiswa
router.get('/getAllMahasiswa', userController.getAllMahasiswa);
router.get('/getMahasiswaByDosen/:nip_dosen', userController.getMahasiswaByDosen);

// PKL


module.exports = router;
