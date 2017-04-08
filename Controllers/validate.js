/**
 * Token validation controller
 */
/* © Shantanu Paul. All rights reserved */

var jwt = require('jsonwebtoken');

exports.validateToken = function(req,res,next){

  var token = req.query.loginToken === undefined ? req.body.loginToken : req.query.loginToken;
    if(token){
        jwt.verify(token,'TOPSECRETTTT',function(err,decodedToken){
           if(err) {
               res.status(401).send({message:'Invalid token'});
           }
            else
           {
               req.decodedToken = decodedToken;
               next();
           }
        });
    }
    else
    {
        res.status(403).send({message:'Forbidden'});
    }
};

