const router = require('express').Router();
const controller = require('../controllers/pkl.controller');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [upload],
    controller.submitPKL);

// router.post('/getPKLByDosen', 
//     [authMiddleware.verifyToken, authMiddleware.isDosen],
//     controller.getPKLByDosen);

module.exports = router;