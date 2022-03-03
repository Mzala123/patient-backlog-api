var express = require('express');
var router = express.Router();

/* path definition */

var ctrlPatient = require('../controllers/patient')
var ctrlAuth = require('../controllers/authentication')

router.post('/patient', ctrlPatient.createPatient)
router.get('/patient', ctrlPatient.read_List_of_patients)

router.post('/register', ctrlAuth.register)
router.post('/login', ctrlAuth.login)


module.exports = router;
