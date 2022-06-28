var express = require('express');
var router = express.Router();

/* path definition */


var ctrlPatient = require('../controllers/patient')
var ctrlAuth = require('../controllers/authentication')

router.post('/patient', ctrlPatient.createPatient)
router.get('/patient', ctrlPatient.list_of_patients)
router.get('/read_one_patient/:patientId', ctrlPatient.read_one_patient)
router.post('/patient/:patientId/add_patient_diagnosis', ctrlPatient.add_patient_diagnosis)


router.post('/register', ctrlAuth.register)
router.post('/login', ctrlAuth.login)
router.get('/list_of_users', ctrlAuth.list_of_users)
router.get('/read_one_user/:email', ctrlAuth.read_one_user)



module.exports = router;
