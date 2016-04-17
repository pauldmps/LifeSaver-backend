/**
 * User Model for mongodb
 */
/* © Shantanu Paul. All rights reserved */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    token : {
        type : String,
        required : false
    },
    bloodGroup: {
        type: String,
        required: true
    },
    location: {
        type: [Number],
        required: false,
        index: '2dsphere'
    },
    profilePicture: {
        type: String,
        required: false
    }
});

userSchema.pre('save',function(callback){
    var user = this;

    if(!user.isModified('password')){return callback();}

    bcrypt.genSalt(5,function(err,salt){
        if(err){return callback(err);}

        bcrypt.hash(user.password,salt,null,function(err,hash){
            if(err){return callback(err);}
            user.password = hash;
            callback();
        });
    });
});

userSchema.methods.matchPassword = function(password,callback){
    bcrypt.compare(password,this.password,function(err,isMatch){
        if(err){return callback(err);}
        callback(null,isMatch);
    });
};

module.exports = mongoose.model('User',userSchema);