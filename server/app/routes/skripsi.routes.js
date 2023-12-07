const router = require('express').Router();
const controller = require('../controllers/skripsi.controller');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [upload],
    controller.submitSkripsi);

router.get(
    '/rekap/:status/:angkatan', 
    controller.getSkripsiByDosen);

router.get(
    '/rekap', 
    controller.getRekapSkripsiByDosen);

module.exports = router;