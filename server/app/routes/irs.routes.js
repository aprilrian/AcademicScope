const express = require('express');
const path = require("path");
const router = express.Router();
const irsController = require('../controllers/irs.controller');
const multerUpload = require("../services/multer.service");

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Submit IRS
router.post('/submit', multerUpload.single('file'), irsController.submitIRS);

// Get IRS for the logged-in Mahasiswa
router.get('/get', irsController.getIRS);

// Get all IRS records for all Mahasiswa
router.get('/getAll', irsController.getAllIRS);

// Download IRS file for a specific semester
router.get('/download/:semester_aktif', irsController.downloadIRS);

// Academic advisor view: Get IRS records that need verification
router.get('/wali', irsController.waliIRS);

// Academic advisor verify IRS
router.put('/verify/:nim/:semester_aktif', irsController.verifyIRS);

// Delete all IRS records (for testing purposes)
router.delete('/deleteAll', irsController.deleteAllIRS);

module.exports = router;
