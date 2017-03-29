/* REST server for LifeSaver application */
/* © Shantanu Paul. All rights reserved */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var multer = require('multer');
var upload = multer({dest: process.env.OPENSHIFT_DATA_DIR});
//var upload = multer({dest: './uploads/'}); //NOSONAR
var busboy = require('connect-busboy');


var userController = require('./Controllers/user');
var authController = require('./Controllers/auth');
var tokenController = require('./Controllers/validate');

mongoose.connect('mongodb://heroku_hjtb042q:rna58dfp446qr7faq8si55e82d@ds145370.mlab.com:45370/heroku_hjtb042q'); //NOSONAR
/*//mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + 'lifesaver'); //NOSONAR
//mongoose.connect('mongodb://127.0.0.1:27017/test'); //NOSONAR*/

app.use(bodyParser.urlencoded({extended:true}));
app.use(busboy());
app.use(bodyParser.json());


app.post('/register',userController.register);
app.post('/signin',authController.authorize,userController.signin);

app.all('/auth/*',tokenController.validateToken);

app.get('/auth/user',userController.getUser);
app.get('/auth/location',userController.getUserlocation);
app.get('/auth/nearbyUsers',userController.getNearbyUsers);
app.post('/auth/profilePic',upload.single('profilepic'),function(req,res){
        userController.setProfilePic(req,res);



});
app.get('/auth/profilePic',userController.getProfilePic);


app.listen(process.env.OPENSHIFT_NODEJS_PORT || '8080', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1' ,function () {
    console.log("Listening");
});

