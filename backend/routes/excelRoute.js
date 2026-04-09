const express = require('express');

const { upload, ImportAuth } = require('../controllers/excelController');
const router = express.Router();

router.post('/import-authcode',upload.single('file'),ImportAuth)

module.exports = router;