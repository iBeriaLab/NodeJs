const mongoose = require('mongoose');

//article schema

const navigationSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },    
    url:{
        type:String,
        required: true
    },    
    parent:{
        type:String
    },    
    icon:{
        type:String
    }
});

const Nav = module.exports = mongoose.model('Nav', navigationSchema);