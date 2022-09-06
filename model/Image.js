const mongoose = require("mongoose")

var imageSchema = new mongoose.Schema({
    url: {type: String},
    description: {type: String}
})

mongoose.model('image', imageSchema)