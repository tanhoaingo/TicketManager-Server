const { create, getAll, getAllbyDay } = require('../controllers/invoice.js');

const router = require('express').Router();

router.post('/create', create);

router.get('/getAll', getAll);

router.get('/getAllbyDay', getAllbyDay);

module.exports = router;
