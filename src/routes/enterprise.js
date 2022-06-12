var multer = require('multer');
var express = require('express');
const EnterpriseController = require('../controllers/enterprise');

const router = express.Router();
var app = express();
var upload = multer();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(upload.array());

app.use(express.static('public'));

router.get('/', EnterpriseController.getAll);

router.get('/getAllName', EnterpriseController.getAllName);

router.post('/', EnterpriseController.create);

router.get('/:id', EnterpriseController.getInforbyID);

router.put('/:id', EnterpriseController.update);

module.exports = router;
