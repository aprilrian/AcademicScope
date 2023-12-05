const express = require('express');
const router = express.Router();
const controller = require('../controllers/irs.controller');
const upload = require('../services/upload.service');

// Submit IRS
router.post(
    '/submit',
    [upload],
    controller.submitIRS);

router.get(
    '/getIRSByMahasiswa',
    controller.getIRSByMahasiswa);

router.get(
    '/getIRSByDosen',
    controller.getIRSByDosen);

router.put(
    '/verifikasi/:nim/:semester_aktif',
    controller.verifyIRS);

router.get(
    '/showIRS/:nim/:semester_aktif',
    controller.showIRS);

router.delete(
    '/delete/:nim/:semester_aktif',
    controller.deleteIRS);

module.exports = router;
