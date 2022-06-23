var express = require('express');
var router = express.Router();

/* path definition */

var ctrlPatient = require('../controllers/patient')
var ctrlAuth = require('../controllers/authentication')

router.post('/patient', ctrlPatient.createPatient)
router.get('/patient', ctrlPatient.list_of_patients)
router.get('/read_one_patient/:patient_id', ctrlPatient.read_one_patient)

router.post('/register', ctrlAuth.register)
router.post('/login', ctrlAuth.login)
router.get('/users_list', ctrlAuth.list_of_users)


module.exports = router;
