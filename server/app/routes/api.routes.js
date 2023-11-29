const express = require('express');
const router = express.Router();

router.use('/kabupatenKota', require('./kabupatenKota.routes'));
router.use('/provinsi', require('./provinsi.routes'));

module.exports = router;