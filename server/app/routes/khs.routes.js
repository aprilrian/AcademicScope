const router = require('express').Router();
const controller = require('../controllers/khs.controller');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [upload],
    controller.submitKHS);

router.get(
    '/getKHSBelumByDosen',
    controller.getKHSBelumByDosen);

router.put(
    '/verify/:nim/:semester_aktif',
    controller.verifyKHS);

router.get(
    '/showKHS/:nim/:semester_aktif',
    controller.showKHS);

router.put(
    '/edit/:nim/:semester_aktif',
    controller.editKHS);

router.delete(
    '/delete/:nim/:semester_aktif',
    controller.deleteKHS);

module.exports = router;