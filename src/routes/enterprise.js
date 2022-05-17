var multer = require('multer');
var express = require('express');
const EnterpriseController = require('../controllers/enterprise');
const { requireSignin } = require('../middleware');

const router = express.Router();
var app = express();
var upload = multer();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(upload.array());

app.use(express.static('public'));

router.route('/').get(EnterpriseController.getAll);

router.route('/').post(requireSignin, EnterpriseController.create);

module.exports = router;
