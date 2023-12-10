const router = require('express').Router();
const controller = require('../controllers/khs.controller');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [upload],
    controller.submitKHS);

router.put(
    '/verify/:nim/:semester_aktif',
    controller.verifyKHS);

router.put(
    '/edit/:nim/:semester_aktif',
    controller.editKHS);

router.get(
    '/getKHSBelumByDosen',
    controller.getKHSBelumByDosen);

module.exports = router;