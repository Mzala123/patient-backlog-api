var passport = require('passport')
var mongoose = require('mongoose')
const { use } = require('passport')
const { json } = require('body-parser')
const User = mongoose.model('User')



var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}

module.exports.register = function(req, res){
   if(!req.body.name || !req.body.email || !req.body.password){
       sendJSONresponse(res, 400, {
           "message": "all fields are required"
       })
       return;
   }
   var user = new User()
   user.name = req.body.name
   user.email = req.body.email
   user.setPassword(req.body.password)

   user.save(function(err){
       var token
       if(err){
           sendJSONresponse(res, 400, err)
       }else{
           token = user.generateJwt()
           sendJSONresponse(res, 201,{
               "token": token, "user":user
           })
       }
   })
}



module.exports.login = function(req, res){
    if(!req.body.email || !req.body.password){
        sendJSONresponse(res, 400, {
            "message": "All fields are required"
        })
        return;
    }
    passport.authenticate('local', function(err, user, info){
        var token
        if(err){
            sendJSONresponse(res, 400, err)
            return;
        }
        if(user){
            token = user.generateJwt()
            sendJSONresponse(res, 200,{
                "token":token, "name":user.name, "email": user.email
            })
        }else{
            sendJSONresponse(res, 401, info)
        }
    })(req, res);
}


module.exports.read_one_user = function(req, res){
    var email = req.params.email
    console.log("The email in the form is "+email);
    if(!email){
        sendJSONresponse(res, 400, {"message":"email is required"})
    }else if(req.params && email){
        User
          .findOne({email:email})
          .exec(function(err, user){
            if(!user){
                sendJSONresponse(res, 404, {"message":"no such email record"})
            }  
            else if(err){
                sendJSONresponse(res, 401, err)
            }else if(user){
                sendJSONresponse(res, 200, {message:"Email already in use with another Account","email":user.email})
            }
          })
    }

}


module.exports.list_of_users = function(req, res){
    User
    .find({},{name:1,email:1})
    .exec(function(err, user){
        if(err){
          sendJSONresponse(res, 404, err)
        }else{
            console.log(user)
            sendJSONresponse(res, 200, user)
        }
    })

}

module.exports.count_of_users = function(req, res){
         User
         .countDocuments({})
         .exec(function(err, user){
              if(err){
                sendJSONresponse(res, 401, err)
              }else{
                sendJSONresponse(res, 200, user)
              }
         })
}