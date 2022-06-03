const {
  create,
  getAll,
  getAllByIdTrip,
  getSeatInWagon,
  getTotalTicket_Sale,
  getDateByMonthYear,
  createAllWagons,
} = require('../controllers/wagonTicket.js');

const router = require('express').Router();

router.post('/create', create);

router.post('/createAllWagons', createAllWagons);

router.get('/', getAll);

router.post('/getAllByIdTrip', getAllByIdTrip);

router.post('/getSeatInWagon', getSeatInWagon);

router.post('/getTotalTicket_Sale', getTotalTicket_Sale);

router.post('/getDateByMonthYear', getDateByMonthYear);

module.exports = router;
