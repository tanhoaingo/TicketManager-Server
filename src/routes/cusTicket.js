const { create, updateCancel } = require('../controllers/cusTicket.js');

const router = require('express').Router();

router.post('/create', create);
router.put('/cancelticket', updateCancel);

module.exports = router;
