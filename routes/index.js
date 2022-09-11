var express = require('express');
var router = express.Router();

//define service for multer
const upload = require("../services/upload")

var ctrlPatient = require('../controllers/patient')
var ctrlAuth = require('../controllers/authentication')

//requiring controller for image uploads 
var ctrlImg = require("../controllers/images")

router.post('/patient', ctrlPatient.createPatient)
router.get('/patient', ctrlPatient.list_of_patients)

router.get('/read_one_patient/:patientId', ctrlPatient.read_one_patient)
router.put('/patient/:patientId', ctrlPatient.update_patient)
router.post('/patient/:patientId/add_patient_diagnosis', ctrlPatient.add_patient_diagnosis)
router.get('/patients_count_by_gender',ctrlPatient.patients_count_by_gender)
router.get('/count_all_patients', ctrlPatient.count_all_patients)

router.post('/register', ctrlAuth.register)
router.post('/login', ctrlAuth.login)
router.get('/list_of_users', ctrlAuth.list_of_users)
router.get('/read_one_user/:email', ctrlAuth.read_one_user)
router.get('/read_user_by_id/:userId', ctrlAuth.read_user_by_id)
router.put('/update_one_user/:userId', ctrlAuth.update_one_user)
router.get('/count_of_users', ctrlAuth.count_of_users)

// cloudinary image post and get routes
router.post('/upload_image', upload.single("picture"), ctrlImg.uploadImage)
router.get('/get_images', ctrlImg.getImages)

// socket.io with rest APIs
router.post('/socket_trial', ctrlImg.socket_trial)

module.exports = router;
