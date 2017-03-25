/* REST server for LifeSaver application */
/* © Shantanu Paul. All rights reserved */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var multer = require('multer');
var upload = multer({dest: process.env.OPENSHIFT_DATA_DIR});
//var upload = multer({dest: './uploads/'});
var busboy = require('connect-busboy');


var userController = require('./Controllers/user');
var authController = require('./Controllers/auth');
var tokenController = require('./Controllers/validate');


//mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + 'lifesaver');
mongoose.connect('mongodb://127.0.0.1:27017/test');

app.use(bodyParser.urlencoded({extended:true}));
app.use(busboy());
//app.use(upload);
app.use(bodyParser.json());
 /* app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With , content-type, Authorization ,x-access-token ,' +
        'x-auth-email ,x-auth-password');
    next();
}); */

app.post('/register',userController.register);
app.post('/signin',authController.authorize,userController.signin);

app.all('/auth/*',tokenController.validateToken);

app.get('/auth/user',userController.getUser);
app.get('/auth/location',userController.getUserlocation);
app.get('/auth/nearbyUsers',userController.getNearbyUsers);
app.post('/auth/profilePic',upload.single('profilepic'),function(req,res){
        //console.log(req.file);
        userController.setProfilePic(req,res);



});
app.get('/auth/profilePic',userController.getProfilePic);


app.listen(process.env.OPENSHIFT_NODEJS_PORT || '8080', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1' ,function () {
    console.log("Listening");
});

