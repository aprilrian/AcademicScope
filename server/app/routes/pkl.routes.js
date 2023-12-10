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

router.get(
    '/rekap',
    controller.getRekapPKLByDosen);

router.put(
    '/verify/:nim',
    controller.verifyPKL);

router.put(
    '/edit/:nim',
    controller.editPKL);

router.get(
    '/getAll',
    controller.getAllPKL);

router.get(
    '/getPKLBelumByDosen',
    controller.getPKLBelumByDosen);
    
module.exports = router;