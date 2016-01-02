/* REST server for LifeSaver application */
/* © Shantanu Paul. All rights reserved */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

var userController = require('./Controllers/user');
var authController = require('./Controllers/auth');
var tokenController = require('./Controllers/validate');

/*mongoose.connect('mongodb://'+ process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':'
    + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@'
    + process.env.OPENSHIFT_MONGODB_DB_HOST + ':'
    + process.env.OPENSHIFT_MONGODB_DB_PORT + '/lifesaver'); */

mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://127.0.0.1/27017');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With , content-type, Authorization ,x-access-token ,' +
        'x-auth-username ,x-auth-password');
    next();
});

app.post('/register',userController.register);

app.post('/signin',authController.authorize,userController.signin);

app.all('/auth/*',tokenController.validateToken);

app.get('/auth/user',userController.getUser);

app.listen(process.env.OPENSHIFT_NODEJS_PORT || '8080', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1' ,function () {
    console.log( "Listening");
});

