/**
 * Created by Shantanu Paul on 4/8/2017.
 */
var Device = require('../Models/device');
var User = require('../Models/user');


var gcm = require('node-gcm');


exports.registerDevice = function (req,res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            return res.status(400).send(err);
        }

        if (!user) {
            return res.status(403)
                .send({'message': 'User not found. Please register before trying this operation'});
        }
        else {
            Device.findOneAndUpdate({email: req.body.email},
                {
                    $set: {
                        email: req.body.email,
                        loginToken: req.body.loginToken,
                        gcmToken: req.body.gcmToken
                    }
                },
                {upsert: true},

                function (err, device) {
                    if (err) {
                        return res.status(400).send(err);
                    }

                    if (device) {
                        return res.status(200).send({'message': 'Device ID saved'});
                    }
            });
        }
    });
};

exports.sendMessage = function (req, res) {
    var sender = new gcm.Sender('AIzaSyAzHEL0y-DP9SU5BmQkjBqF7LJAVLDtM9k');
    var message = new gcm.Message({
        data: {'message':'User user1 just contacted you!'}
    });

    Device.find({},{gcmToken : 1})
        .select('gcmToken')
        .exec(function (err,tokens){
            tokens = tokens.map(function(token) {
                    return token.gcmToken
                });
                if(err){
                    return res.json(err)
                }

            sender.send(message, {registrationTokens: tokens},function (err,response) {
                if(err){
                    return res.status(400).send(err);
                }
                return res.status(200).send(response);
            });

        });
};






