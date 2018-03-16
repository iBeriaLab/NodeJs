const mongoose = require('mongoose');

//User Schema
const UserSchema = mongoose.Schema({
    facebookId:{
        type: String,
        require: false
    },
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
        require: true
    },
    birthday:{
        type: String
    },
    gender:{
        type: String
    },
    hometown:{
        type: String
    },
    facebookURL:{
        type: String
    },
    isAdmin:{
        type: Boolean,
        require: false
    },
    isVerify:{
        type: Boolean,
        require: false
    },
    avatar:{
        type: String,
        require: false
    },
    email:{
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    token: String,
    date:{
        type:String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);