const { default: mongoose } = require("mongoose")
var Patient = mongoose.model("patient")

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}

module.exports.createPatient = function(req, res){
    if(!req.body.firstname || !req.body.lastname || !req.body.gender){
              sendJSONresponse(res, 400, {"message":"Fill in all required fields"})
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
            
            patient.save(function(err){
                if(err){
                  sendJSONresponse(res, 404, {"err":err, "message":"Failed to create patient record"})
                }else{
                    sendJSONresponse(res, 201, {"message":"patient record created"});
                }
            })

}

module.exports.list_of_patients = function(req, res){
    Patient
       .find({})
       .exec(function(err, patient){
           if(err){
             sendJSONresponse(res, 404, err);
           }else{
             sendJSONresponse(res, 200, patient)
           }
       })
     
}

module.exports.read_one_patient = function(req, res){
        if(!req.params.patientId){
            sendJSONresponse(res, 404, {"message":"patient id is required!"})
        }else if(req.params && req.params.patientId){
             Patient
                .findById(req.params.patientId)
                .exec(function(err, patient){
                    if(!patient){
                       sendJSONresponse(res, 404, {"message": "no such patient record"})
                    }
                    else if(err){
                         sendJSONresponse(res, 404, err)
                    }else{
                        sendJSONresponse(res, 200, patient)
                    }
                })
        }
}

module.exports.add_patient_diagnosis = function(req, res){
       var patientId = req.params.patientId
       if(patientId){
         Patient
           .findById(patientId)
           .select('health_record')
           .exec(function(err, patient){
              if(err){
                sendJSONresponse(res, 404, err)
              }else{
                addDiagnosis(req, res, patient)
              }
           })
       }else{
          sendJSONresponse(res, 404, {"message":"Not found patient required"})
       }       
}

var addDiagnosis = function(req, res, patient){
    if(!patient){
        sendJSONresponse(res, 404, {"message":"diagnosis not available"})
    }else{
        patient.health_record.push({
            weight: req.body.weight,
            height: req.body.height,
            temperature: req.body.temperature,
            diagnosis: req.body.diagnosis
        })
        patient.save(function(err, patient){
            var thisDiagnosis
            if(err){
              sendJSONresponse(res, 400, err)
            }else{
              thisDiagnosis = patient.health_record[patient.health_record.length -1]
              sendJSONresponse(res, 201, thisDiagnosis)
            }
        })
    }
}
  