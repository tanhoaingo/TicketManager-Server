const {
  getById,
  getAll,
  update,
  updatePassword,
  fetchUserTicket,
  test,
} = require('../controllers/user');

const router = require('express').Router();

// router.get("/:id", getById);
router.get('/:id/info', getById);

router.put('/:id', update);
router.put('/changepassword/:id', updatePassword);
router.post('/fetchUserTicket', fetchUserTicket);
router.get('/test', test);

router.get('/', getAll);

module.exports = router;
