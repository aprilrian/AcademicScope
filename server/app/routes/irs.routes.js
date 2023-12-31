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
    '/getIRSBelumByDosen',
    controller.getIRSBelumByDosen);

router.put(
    '/verify/:nim/:semester_aktif',
    controller.verifyIRS);

router.get(
    '/show/:nim/:semester_aktif',
    controller.showIRS);

router.delete(
    '/delete/:nim/:semester_aktif',
    controller.deleteIRS);

router.put(
    '/edit/:nim/:semester_aktif',
    controller.editIRS);

router.get(
    '/download/:nim/:semester_aktif',
    controller.downloadIRS);

module.exports = router;
