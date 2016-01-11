/**
 * API Endpoints for user
 */
/* © Shantanu Paul. All rights reserved */

var User = require('../Models/user');
var jwt = require('jsonwebtoken');

exports.register = function (req, res) {

    User.findOne({email:req.body.email},function(err,user){
        if(user){return res.status(403).send({message:'User already exists'});}

          var newUser = new User({
              name:req.body.name,
              email:req.body.email,
              password:req.body.password,
              token:'',
              bloodGroup:req.body.bloodGroup
               });

          newUser.save(function(err){
          if(err) {res.send(err);}

        //res.json({message:'New user added'});
        //  signin(req,res);
        });
    });
};

exports.signin = signin= function (req,res){
    User.findOne({email:req.body.email},function(err, user){
        if(err){res.send(err);}


        console.log(user);
            user.token = jwt.sign(user.password, 'TOPSECRETTTT');
            user.save(function (err,user) {
                if (err) {
                    res.send(err);
                }
                res.json({email:user.email,token:user.token});
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
