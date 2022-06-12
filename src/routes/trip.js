const {
  create,
  getById,
  getAll,
  update,
  deleteById,
  fetchAll,
  getInfoById,
  getInfoByIdAndLocation,
  // getInforbyID,
} = require('../controllers/trip.js');

const router = require('express').Router();

router.post('/create', create);

router.get('/id=:id', getById);

router.get('/', getAll);

router.post('/fetch', fetchAll);

router.put('/:id', update);

router.delete('/:id', deleteById);

router.get('/:id/informations', getInfoById);
router.post('/:id/informations', getInfoByIdAndLocation);

module.exports = router;
