const mongoose = require('mongoose');

//article schema

const gallerycategoriesSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
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

const galleryCategory = module.exports = mongoose.model('galleryCategory', gallerycategoriesSchema);