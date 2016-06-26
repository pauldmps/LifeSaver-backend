/**
 * Token validation controller
 */
/* © Shantanu Paul. All rights reserved */

var jwt = require('jsonwebtoken');

exports.validateToken = function(req,res,next){

  var token = req.query.token;
    if(token){
        console.log("Token found");
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
        console.log("Token not found");
        res.status(403).send({message:'Forbidden'});
    }
};

