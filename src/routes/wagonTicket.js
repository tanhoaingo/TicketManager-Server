const {
  create,
  getAll,
  getAllByIdTrip,
  getSeatInWagon,
  getTotalTicket_Sale,
  getDateByMonthYear,
  createAllWagons,
  getReportEnterprises,
  getCurrentDate,
  getCurrentByEnterprisesList,
  getCurrentByEnterprises,
} = require('../controllers/wagonTicket.js');

const router = require('express').Router();

router.post('/create', create);

router.post('/createAllWagons', createAllWagons);

router.get('/', getAll);

router.post('/getAllByIdTrip', getAllByIdTrip);

router.post('/getSeatInWagon', getSeatInWagon);

router.post('/getTotalTicket_Sale', getTotalTicket_Sale);

router.post('/getReportEnterprises', getReportEnterprises);

router.post('/getDateByMonthYear', getDateByMonthYear);

router.get('/getCurrentDate', getCurrentDate);

router.get('/getCurrentByEnterprisesList', getCurrentByEnterprisesList);

router.get('/getCurrentByEnterprises', getCurrentByEnterprises);

module.exports = router;
