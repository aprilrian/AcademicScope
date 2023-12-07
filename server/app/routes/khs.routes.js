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

module.exports = router;