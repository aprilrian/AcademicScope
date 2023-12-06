const router = require('express').Router();
const controller = require('../controllers/skripsi.controller');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [upload],
    controller.submitSkripsi);

module.exports = router;