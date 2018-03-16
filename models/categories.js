const mongoose = require('mongoose');

//article schema

const categoriesSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    slug:{
        type:String
    },
    icon:{
        type:String,
        required: true
    },
    parent:{
        type:String,
        required: false
    },
    date:{
        type:String
    }
});

const Category = module.exports = mongoose.model('Category', categoriesSchema);