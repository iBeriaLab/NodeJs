const mongoose = require('mongoose');

//article schema

const donationSchema = mongoose.Schema({
    money:{
        type:String,
        required: true
    },
    userId:{
        type:String,
        required: true
    },
    sendDate:{
        type:Date,
        required: true
    },
    status:{
        type:Boolean
    },
    date:{
        type:String
    }
});

const Donation = module.exports = mongoose.model('Donation', donationSchema);
