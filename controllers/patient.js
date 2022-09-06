const { default: mongoose } = require("mongoose")
var Patient = mongoose.model("patient")
var socketapi = require('../socketapi')


var sendJSONresponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

//start trial pusher
module.exports.trial_pusher = function (req, res) {


}

module.exports.create_trial_pusher = function (req, res) {
  socketapi.io.on("connection", function (socket) {
    data = {
      points: 1,
      os: req.body.os
    }
    socket.on('os-poll', (data) => {
      socket.io.emit('os-vote', data)
    })
  })
  
  sendJSONresponse(res, 201, { "message": "Thank you for voting" })

}

//Trial pusher

module.exports.createPatient = function (req, res) {
  if (!req.body.firstname || !req.body.lastname || !req.body.gender) {
    sendJSONresponse(res, 400, { "message": "Fill in all required fields" })
    return;
  }
  var patient = new Patient();
  patient.firstname = req.body.firstname
  patient.lastname = req.body.lastname
  patient.gender = req.body.gender
  patient.birthdate = req.body.birthdate
  patient.district = req.body.district
  patient.village = req.body.village
  patient.occupation = req.body.occupation

  patient.save(function (err, data) {
    if (err) {
      sendJSONresponse(res, 404, { "err": err, "message": "Failed to create patient record" })
    } else {
      //socketapi.io.on('patient_data', )
      sendJSONresponse(res, 201, { "message": "patient record created" });

    }
  })

}

module.exports.list_of_patients = function (req, res) {
  Patient
    .find({})
    .exec(function (err, patient) {
      if (err) {
        sendJSONresponse(res, 404, err);
      } else {
        sendJSONresponse(res, 200, patient)
      }
    })

}

module.exports.read_one_patient = function (req, res) {
  if (!req.params.patientId) {
    sendJSONresponse(res, 404, { "message": "patient id is required!" })
  } else if (req.params && req.params.patientId) {
    Patient
      .findById(req.params.patientId)
      .exec(function (err, patient) {
        if (!patient) {
          sendJSONresponse(res, 404, { "message": "no such patient record" })
        }
        else if (err) {
          sendJSONresponse(res, 404, err)
        } else {
          sendJSONresponse(res, 200, patient)
        }
      })
  }
}

module.exports.update_patient = function (req, res) {

  var firstname = req.body.firstname
  var lastname = req.body.lastname
  var district = req.body.district
  var gender = req.body.gender
  var village = req.body.village
  var birthdate = req.body.birthdate
  var occupation = req.body.occupation

  if (!req.params.patientId) {
    sendJSONresponse(res, 404, { "message": "patient id is required" })
  } else if (req.params && req.params.patientId) {
    Patient.updateOne({ _id: req.params.patientId },
      {
        $set: {
          firstname: firstname,
          lastname: lastname,
          gender: gender,
          birthdate: birthdate,
          district: district,
          village: village,
          occupation: occupation
        }
      }
    ).exec(function (err) {
      if (err) {
        sendJSONresponse(res, 404, err)
      } else {
        sendJSONresponse(res, 200, { "message": "patient record updated!" })
      }
    })
  }
}

module.exports.add_patient_diagnosis = function (req, res) {
  var patientId = req.params.patientId
  if (patientId) {
    Patient
      .findById(patientId)
      .select('health_record')
      .exec(function (err, patient) {
        if (err) {
          sendJSONresponse(res, 404, err)
        } else {
          addDiagnosis(req, res, patient)
        }
      })
  } else {
    sendJSONresponse(res, 404, { "message": "Not found patient required" })
  }
}

var addDiagnosis = function (req, res, patient) {
  if (!patient) {
    sendJSONresponse(res, 404, { "message": "diagnosis not available" })
  } else {
    patient.health_record.push({
      weight: req.body.weight,
      height: req.body.height,
      temperature: req.body.temperature,
      diagnosis: req.body.diagnosis
    })
    patient.save(function (err, patient) {
      var thisDiagnosis
      if (err) {
        sendJSONresponse(res, 400, err)
      } else {
        thisDiagnosis = patient.health_record[patient.health_record.length - 1]
        sendJSONresponse(res, 201, thisDiagnosis)
      }
    })
  }
}

module.exports.patients_count_by_gender = function (req, res) {
  Patient
    .aggregate([
      {
        $group: {
          _id: '$gender',
          patientCount: { $count: {} },
        }
      },
      { $sort: { 'patientCount': 1 } }
    ]
    ).exec(function (err, patient) {
      if (err) {
        sendJSONresponse(res, 404, err)
      } else {
        sendJSONresponse(res, 200, patient)
      }
    })
}

module.exports.count_all_patients = function (req, res) {
  Patient
    .countDocuments({})
    .exec(function (err, patient) {
      if (err) {
        sendJSONresponse(res, 404, err)
      } else {
        socketapi.io.on('patient_created', (data) => {
          data = patient
          socketapi.io.broadcast.emit('patient', data)
          sendJSONresponse(res, 200, data)
        })

      }
    })

}


