const mongoose = require('mongoose');

// article schema
var photoSchema = mongoose.Schema({
    photo:  {
        type: String
    }
}, {
    timestamps: true
});

const gallerySchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    cover:{
        type:String
    },
    photos:{
        type:Array
    },
    description:{
        type:String,
        required: true
    },
    date:{
        year:{
            type: String
        },
        month:{
            type: String
        },
        weekday:{
            type: String
        },
        day:{
            type: String
        },
        clock:{
            type: String
        }
    }
});

const Gallery = module.exports = mongoose.model('Gallery', gallerySchema);