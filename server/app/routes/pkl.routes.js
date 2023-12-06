const router = require('express').Router();
const controller = require('../controllers/pkl.controller');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [upload],
    controller.submitPKL);

router.get(
    '/rekap/:status/:angkatan',
    controller.getPKLByDosen);

module.exports = router;