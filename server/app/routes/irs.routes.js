const express = require('express');
const router = express.Router();
const controller = require('../controllers/irs.controller');
const { authMiddleware, userMiddleware } = require('../middlewares');
const upload = require('../services/upload.service');

// Submit IRS
router.post(
    '/submit',
    [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID ,userMiddleware.hasUpdateProfile, upload],
    controller.submitIRS);

router.get(
    '/getIRSByMahasiswa',
    [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.getMahasiswaByID],
    controller.getIRSByMahasiswa);

module.exports = router;
