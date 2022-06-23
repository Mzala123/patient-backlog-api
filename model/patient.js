var mongoose = require('mongoose')

var healthRecordSchema = new mongoose.Schema({
    weight: {type: Number, required: true},
    hieght: {type: Number, required: true},
    temparature: {type: String, requierd:true},
    diagnosis: {type: String}
})

var patientSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    gender: {type: String},
    birthdate: {type: Date},
    district: {type: String},
    village: {type: String},
    occupation: {type: String},
    health_record: [healthRecordSchema]
})

mongoose.model('patient', patientSchema)
