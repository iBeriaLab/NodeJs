const mongoose = require('mongoose');

//article schema

const sliderSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    photo:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    link:{
        type:String,
        require:false
    },
    date:{
        type:String
    }
});

const Slider = module.exports = mongoose.model('Slider', sliderSchema);