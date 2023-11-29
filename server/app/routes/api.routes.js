const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const kabupatenKotaController = require('../controllers/kabupatenKota.controller');
const provinsiController = require('../controllers/provinsi.controller');

// Kabupaten Kota
router.get('/kabupatenKota', kabupatenKotaController.getAll);
router.get('/kabupatenKota/:kode_provinsi', kabupatenKotaController.getAllByProvinsi);

// Provinsi
router.get('/provinsi', provinsiController.getAll);

// User
router.get('/dosen', userController.getAllDosen);
router.get("/batchTemplate", userController.getBatchTemplate)

module.exports = router;
