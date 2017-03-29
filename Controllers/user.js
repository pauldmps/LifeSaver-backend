/**
 * API Endpoints for user
 */
/* © Shantanu Paul. All rights reserved */

var User = require('../Models/user');
var jwt = require('jsonwebtoken');
var fs = require('fs');


var dirName = process.env.OPENSHIFT_DATA_DIR;
//var dirName = './uploads/'; //NOSONAR


exports.validate = function(req,res,next) {
  if(req.body.email === undefined){
      return res.status(401).send({'message':'Email is required'});
  }

  if(req.body.password === undefined){
      return res.status(401).send({'message':'Password is required'});
  }

  next();
};

const login = exports.login = function (req,res){
    User.findOne({email:req.body.email},function(err, user){
        if(err){
            return res.status(401).send(err);
        }
        user.token = jwt.sign(user.password, 'TOPSECRETTTT');
        user.save(function (err,user) {
            if (err) {
                res.send(err);
                return;
            }
            res.status(200).send({email:user.email,token:user.token});
        })
    });
};

exports.register = function (req, res) {

    User.findOne({email:req.body.email},function(err,user){
        if(user){
            return res.status(403).send({message:'User already exists'});
        }

          var newUser = new User({
              name:req.body.name,
              email:req.body.email,
              password:req.body.password,
              token:'',
              bloodGroup:req.body.bloodGroup,
              location:[req.body.longitude,req.body.latitude],
              profilePicture:req.body.profilePicture
               });

          newUser.save(function(err){
          if(err) {
              return res.status(400).send(err);
          }
              login(req,res);
        });
    });
};



exports.getUser = function(req,res){
  User.findOne({email:req.query.email},function(err, user){
      if(err){
          res.send(err);
      }

      if(!user){
          res.status(404).send({message:'user not found'});
      }

      else if(user.password === req.decodedToken){
          res.json(user);
      }
      else
      res.status(403).send({message:'token validation failed'});
  })
};


exports.getUserlocation = function(req,res){
    User.findOne({email:req.query.email}, function (err,user) {
        if(err){
            res.send(err);
        }

        if(!user){
            res.status(404).send({message:'user not found'});
        }

        else if(user.password === req.decodedToken){
            res.status(200).send({'latitude':user.location[1],'longitude':user.location[0]});
        }
    });
};

exports.getNearbyUsers = function(req,res) {
    User.findOne({email: req.query.email}, function (err, user) {
        if (err) {
            res.status(503).send(err);
        }

        if (!user) {
            res.status(404).send({message: 'user not found'});
        }

        else if (user.password === req.decodedToken) {
            User.find({$and:[{location: {
                    $near: {
                        $geometry: {type: 'Point', coordinates: [user.location[0], user.location[1]]},
                        $maxDistance: req.query.maxDistance
                    }
                }},
                    {email:{$ne:req.query.email}}]},
                {name: 1, email: 1, bloodGroup: 1, location: 1}, function (err, result) {

                res.status(200).send(result);

            });
        }
    });
};
exports.getProfilePic = function(req,res) {
    User.findOne({email: req.query.email}, function (err, user) {
        if (err) {
            res.send(err);
        }
        if (!user) {
            res.status(404).send({message: 'user not found'});
        }
        else if (user.password === req.decodedToken) {
            var img = fs.readFile(dirName + user._id, function (err) {
                if(err){
                    res.send(err)
                }
                else {
                    res.writeHead(200, {'Content-Type': 'image/jpg'});
                    res.end(img, 'binary');
                }
            });
        }
    });
};


exports.setProfilePic = function(req,res){
       User.findOne({email: req.query.email}, function (err, user) {
               if (err) {
                   res.send(err);
               }
               if (!user) {
                   res.status(404).send({message: 'user not found'});
               }
               else if (user.password === req.decodedToken) {
                   fs.rename(dirName + req.file.filename, dirName + user._id, function(err){
                       if (err) {
                           res.send(err);
                       }
                       else {
                          res.status(200).send({message:'OK'});
                       }
                   });
               }
           });
       };
