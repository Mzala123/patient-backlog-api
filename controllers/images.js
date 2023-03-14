const { default: mongoose } = require("mongoose")
var Image = mongoose.model("image")
const socketapi = require("../socketapi")
const events = require("events")
const net = require("net")
const channel = new events.EventEmitter()

var sendJSONresponse = function (res, status, content) {
    res.status(status)
    res.json(content)
  }

module.exports.getImages = async function(req, res){
     try{

        let images = await  Image.find({}, "-__v")
        console.log(images)
        sendJSONresponse(res, 200, {images, "message":"image info fetched"})
     }catch(error){
        console.log(error)
        sendJSONresponse(res, 500, error)
     }
}

module.exports.uploadImage = async function(req, res){
     try{
        if(req.file && req.file.path){
            const image = new Image({
                description: req.body.desc,
                url: req.file.path
            })
            console.log(req.file)
            await image.save();
            sendJSONresponse(res, 201, {"message":"image successfully saved"})
        }else{
            console.log(req.file)
            sendJSONresponse(res, 422, {error:"invalid"})
        }

     }catch(error){
         console.log(error)
     }
}

module.exports.socket_trial = function(req, res){
       let user_details = {
          fname: req.body.fname,
          lname: req.body.lname
       }

       socketapi.io.on("connection", function(socket){
            //console.log("are you connecting trial mzala", socket.id)
             socket.emit("receive_user_data", user_details)
       })
      //sendJSONresponse(res, 201, user_details)
       console.log("userdetails "+user_details.fname, user_details.lname);
}