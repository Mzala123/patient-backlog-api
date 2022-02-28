var mongoose = require('mongoose')

var patientSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    gender: {type: String},
    birthdate: {type: Date},
    currentAddress: {type: String},
    occupation: {type: String}
})

mongoose.model('patient', patientSchema)
