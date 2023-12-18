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

router.get(
    '/getPKLBelumByDosen',
    controller.getPKLBelumByDosen);

router.get(
    '/getAll',
    controller.getAllPKL);

router.put(
    '/edit/:nim',
    controller.editPKL);

router.get(
    '/show/:nim',
    controller.showPKL);

router.get(
    '/download/:nim',
    controller.downloadPKL);

router.put(
    '/verify/:nim',
    controller.verifyPKL);

router.delete(
    '/delete/:nim',
    controller.deletePKL);

router.put(
    '/edit/:nim',
    controller.editPKL);
    
module.exports = router;