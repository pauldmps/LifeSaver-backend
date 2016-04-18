/**
 * API Endpoints for user
 */
/* © Shantanu Paul. All rights reserved */

var User = require('../Models/user');
var jwt = require('jsonwebtoken');
var fs = require('fs');


var dirName = process.env.OPENSHIFT_DATA_DIR;
//var dirName = './uploads/';

exports.register = function (req, res) {

    User.findOne({email:req.body.email},function(err,user){
        if(user){return res.status(403).send({message:'User already exists'});}

          var newUser = new User({
              name:req.body.name,
              email:req.body.email,
              password:req.body.password,
              token:'',
              bloodGroup:req.body.bloodGroup,
              location:[req.body.lon,req.body.lat],
              profilePicture:req.body.profilePicture
               });

          newUser.save(function(err){
          if(err) {res.send(err);}

        //res.json({message:'New user added'});
          signin(req,res);
        });
    });
};

exports.signin = signin = function (req,res){
    User.findOne({email:req.body.email},function(err, user){
        if(err){res.send(err);}

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

exports.getUser = function(req,res){
  User.findOne({email:req.headers['x-auth-email']},function(err, user){
      if(err){res.send(err);}

      if(!user){res.status(404).send({message:'user not found'});
      }

      else if(user.password == req.decodedToken){
          res.json(user);
      }
      else
      res.status(403).send({message:'token validation failed'});
  })
};


exports.getUserlocation = function(req,res){
    User.findOne({email:req.headers['x-auth-email']}, function (err,user) {
        if(err){res.send(err);}

        if(!user){res.status(404).send({message:'user not found'});
        }

        else if(user.password == req.decodedToken){
            res.status(200).send({'latitude':user.location[1],'longitude':user.location[0]});
        }
    });
};

exports.getNearbyUsers = function(req,res) {
    User.findOne({email: req.headers['x-auth-email']}, function (err, user) {
        if (err) {
            res.send(err);
        }

        if (!user) {
            res.status(404).send({message: 'user not found'});
        }

        else if (user.password == req.decodedToken) {
            User.find({
                location: {
                    $near: {
                        $geometry: {type: 'Point', coordinates: [user.location[0], user.location[1]]},
                        $maxDistance: req.headers['max-distance']
                    }
                }
            }, {name: 1, bloodGroup: 1, location: 1}, function (err, result) {

                res.status(200).send(result);

            });
        }
    });
};
exports.getProfilePic = function(req,res) {
    User.findOne({email: req.headers['x-auth-email']}, function (err, user) {
        if (err) {
            res.send(err);
        }
        if (!user) {
            res.status(404).send({message: 'user not found'});
        }
        else if (user.password == req.decodedToken) {
            var img = fs.readFile(dirName + user._id, function (err) {
                if(err){res.send(err)}
                else {
                    res.writeHead(200, {'Content-Type': 'image/jpg'});
                    res.end(img, 'binary');
                }
            });
        }
    });
};


exports.setProfilePic = function(req,res){
        console.log('inside function');
       User.findOne({email: req.headers['x-auth-email']}, function (err, user) {
              console.log('inside findone');
               if (err) {
                   res.send(err);
                   console.log('user findone error');
               }
               if (!user) {
                   res.status(404).send({message: 'user not found'});
                   console.log('user not found');
               }
               else if (user.password == req.decodedToken) {
                   console.log(user._id);
                   //console.log(dirName + req.file.filename);
                   //console.log(dirName + user._id);
                   fs.rename(dirName + req.file.filename,dirName + user._id, function(err){
                       if (err) {
                           res.send(err);
                       }
                       else {
                           user.profilePicture = dirName + user._id;
                           user.save();
                           res.status(200).send({message:'save OK'});
                       }
                   });
               }
           });
       };
