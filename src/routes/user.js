const { getById, getAll } = require('../controllers/user');

const router = require('express').Router();

// router.get("/:id", getById);
router.get('/:id', getById);

router.get('/', getAll);

module.exports = router;
