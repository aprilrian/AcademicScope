const router = require('express').Router();
const controller = require('../controllers/skripsi.controller');
const { authMiddleware, userMiddleware } = require('../middlewares');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.hasUpdateProfile, userMiddleware.getMahasiswaById, upload],
    controller.submitSkripsi);

module.exports = router;