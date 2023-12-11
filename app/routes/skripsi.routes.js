const router = require('express').Router();
const controller = require('../controllers/skripsi.controller');
const upload = require('../services/upload.service');

router.post(
    '/submit', 
    [upload],
    controller.submitSkripsi);

router.get(
    '/rekap/:status/:angkatan', 
    controller.getSkripsiByDosen);

router.get(
    '/rekap', 
    controller.getRekapSkripsiByDosen);

router.put(
    '/verify/:nim', 
    controller.verifySkripsi);

router.put(
    '/edit/:nim', 
    controller.editSkripsi);

router.delete(
    '/delete/:nim', 
    controller.deleteSkripsi);

router.get(
    '/show/:nim', 
    controller.showSkripsi);

router.get(
    '/getAll', 
    controller.getAllSkripsi);

router.get(
    '/getSkripsiBelumByDosen', 
    controller.getSkripsiBelumByDosen);

module.exports = router;