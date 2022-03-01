var express = require('express');
var router = express.Router();

/* path definition */

var ctrlPatient = require('../controllers/patient')

router.post('/patient', ctrlPatient.createPatient)
router.get('/patient', ctrlPatient.read_List_of_patients)


module.exports = router;
