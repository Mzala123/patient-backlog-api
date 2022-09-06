const { default: mongoose } = require("mongoose")
var Image = mongoose.model("image")

var sendJSONresponse = function (res, status, content) {
    res.status(status)
    res.json(content)
  }

module.exports.getImages = async function(req, res){
     try{
        let images = await  Image.find({}, "-__v")
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