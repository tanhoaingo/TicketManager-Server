const { create, getAll } = require('../controllers/invoice.js');

const router = require('express').Router();

router.post('/create', create);

router.get('/getAll', getAll);

module.exports = router;
