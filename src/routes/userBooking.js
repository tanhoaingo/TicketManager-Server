const { create } = require('../controllers/userBooking');
const router = require('express').Router();

router.post('/create', create);

module.exports = router;
