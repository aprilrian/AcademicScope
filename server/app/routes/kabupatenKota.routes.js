const express = require('express');
const router = express.Router();
const controller = require('../controllers/kabupatenKota.controller');

router.get('/', controller.getAll);
router.get('/:kode_provinsi', controller.getAllByProvinsi);

module.exports = router;