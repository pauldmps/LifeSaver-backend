/**
 * API Endpoints for user
 */
/* © Shantanu Paul. All rights reserved */

var User = require('../Models/user');
var jwt = require('jsonwebtoken');

exports.register = function (req, res) {
        var user = new User({
            email:req.body.email,
            password:req.body.password,
            token:''
        });
    user.save(function(err){
        if(err) {res.send(err);}

        //res.json({message:'New user added'});
        signin(req,res);
    });
};

exports.signin = signin = function (req,res){
    User.findOne({email:req.body.email},function(err, user){
        if(err){res.send(err);}



        user.token = jwt.sign(user.password,'TOPSECRETTTT');
        user.save(function(err,user){
            if(err){res.send(err);}

            res.json({email:user.email,token:user.token});
        })
    });
};

exports.getUser = function(req,res){
  User.findOne({email:req.headers['x-auth-email']},function(err, user){
      if(err){res.send(err);}

      if(!user){res.status(404).send({message:'user not found'});
      }

      /* else if(user.token == req.headers['x-access-token']){
          res.json(user); */
      else if(user.password == req.decodedToken){
          res.json(user);
      }
      else
      res.status(403).send({message:'token validation failed'});
  })
};
