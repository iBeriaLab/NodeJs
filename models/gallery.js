const mongoose = require('mongoose');

//article schema

const gallerySchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    photos:{
        type:Array
    },
    author:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    date:{
        type:String
    }
});

const Gallery = module.exports = mongoose.model('Gallery', gallerySchema);