const { getAll, update, create } = require('../controllers/rule');
const router = require('express').Router();

router.get('/', getAll);

router.put('/:id', update);

router.post('/', create);

module.exports = router;
