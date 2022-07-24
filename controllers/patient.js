const { default: mongoose } = require("mongoose")
var Patient = mongoose.model("patient")
const Pusher = require("pusher")

const pusher = new Pusher({
  appId: "1442053",
  key: "7886c74cb280b6831fcb",
  secret: "c8496aa468bb5e059d1a",
  cluster: "ap2",
  useTLS: true
});


var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}

//start trial pusher
module.exports.trial_pusher = function(req, res){
     sendJSONresponse(res, 200, {message:"Trial by fire pusher"})
}

module.exports.create_trial_pusher = function(req, res){
     pusher.trigger("os-poll", "os-vote", {
         points: 1,

     })
     return sendJSONresponse(res, 200, {message:"Trial working"})
}

//Trial pusher

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

module.exports.patients_count_by_gender = function(req, res){
        Patient
          .aggregate([
            {
              $group: {
                _id: '$gender',
                patientCount: {$count: {}},
              }
            }, 
             {$sort:{'patientCount':1}}
          ]
          ).exec(function(err, patient){
             if(err){
              sendJSONresponse(res, 404, err)
             }else{ 
              sendJSONresponse(res, 200, patient)
             }
          })
}

module.exports.count_all_patients = function(req, res){
       Patient
          .countDocuments({})
          .exec(function(err, patient){
            if(err){
              sendJSONresponse(res, 404, err)
            }else{
              sendJSONresponse(res, 200, patient)
            }
          })
          
}


  