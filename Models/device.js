var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({
    email :{
        type: String,
        required: true
    },
    loginToken :{
        type: String,
        required: true
    },
    gcmToken :{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Device',deviceSchema);