const router = require('express').Router();
const controller = require('../controllers/khs.controller');
const { authMiddleware, userMiddleware } = require('../middlewares');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [authMiddleware.verifyToken, authMiddleware.isMahasiswa, userMiddleware.hasUpdateProfile, userMiddleware.getMahasiswaById, upload],
    controller.submitKHS);

module.exports = router;