const mongoose = require('mongoose');

//article schema

const pageSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },    
    slug:{
        type:String,
        required: true
    },    
    author:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required: true
    },
    date:{
        type:String
    }
});

const Page = module.exports = mongoose.model('Page', pageSchema);