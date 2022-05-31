const { create } = require('../controllers/invoice.js');

const router = require('express').Router();

router.post('/create', create);

module.exports = router;
