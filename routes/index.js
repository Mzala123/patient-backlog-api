var express = require('express');
var router = express.Router();

/* path definition */



var ctrlPatient = require('../controllers/patient')
var ctrlAuth = require('../controllers/authentication')

router.get('/trial_pusher', ctrlPatient.trial_pusher)
router.post('/trial_pusher', ctrlPatient.create_trial_pusher)

router.post('/patient', ctrlPatient.createPatient)
router.get('/patient', ctrlPatient.list_of_patients)
router.get('/read_one_patient/:patientId', ctrlPatient.read_one_patient)
router.post('/patient/:patientId/add_patient_diagnosis', ctrlPatient.add_patient_diagnosis)
router.get('/patients_count_by_gender',ctrlPatient.patients_count_by_gender)
router.get('/count_all_patients', ctrlPatient.count_all_patients)


router.post('/register', ctrlAuth.register)
router.post('/login', ctrlAuth.login)
router.get('/list_of_users', ctrlAuth.list_of_users)
router.get('/read_one_user/:email', ctrlAuth.read_one_user)
router.get('/count_of_users', ctrlAuth.count_of_users)



module.exports = router;
