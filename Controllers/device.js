/**
 * Created by Shantanu Paul on 4/8/2017.
 */
var Device = require('../Models/device');
var User = require('../Models/user');


var gcm = require('node-gcm');


exports.registerDevice = function (req,res) {
    User.findOne({email: req.body.email}, function (err) {
        if (err) {
            return res.status(401)
                .send({'message': 'User not found. Please register before trying this operation'});
        }

    Device.findOneAndUpdate({email:req.body.email},
                            {$set:{
                                    email: req.body.email,
                                    loginToken: req.body.loginToken,
                                    gcmToken: req.body.gcmToken
                                  }
                            },
                            {upsert:true},
            
                            function (err) {
                                if(err){
                                    res.status(400).send(err);
                                }
    });
        
    /*Device.findOne({email:req.body.email}, function(err, device){
            if(err){
                return res.status(400).send(err);
            }

            if(device){
                device.gcmToken = req.body.gcmToken;
                device.save();
            }
            else{
                var newDevice = new Device({
                    email: req.body.email,
                    loginToken: req.body.loginToken,
                    gcmToken: req.body.gcmToken
                });

                newDevice.save(function(err){
                    if(err) {
                        return res.status(400).send(err);
                    }
                    return res.status(200).send({'message':'Device ID saved'});
                });
            }

    });*/
        


    });
};

    exports.sendMessage = function (req, res) {

    };






