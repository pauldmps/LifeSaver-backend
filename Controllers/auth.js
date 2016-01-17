/**
 * User authentication controller
 * © Shantanu Paul. All rights reserved
 */

var passport = require('passport');
var User = require('../Models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({usernameField: 'email',
                                passwordField: 'password'},
(function(username,password,callback) {
    console.log('passport called');
    User.findOne({email:username},function(err, user){
        console.log('email at passport: ' + email);
        if(err){
           return callback(err);}


       if(!user){return callback(null,false);}

        user.matchPassword(password,function(err,isMatch){
            if(err){return callback(err);}

            if(!isMatch){return callback(null,false);}

            console.log('isMatch: ' + isMatch);
            return callback(null,user);
        });
    });
})));

exports.authorize = passport.authenticate('local', { session : false });