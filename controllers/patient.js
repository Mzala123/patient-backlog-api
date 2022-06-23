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

}
  