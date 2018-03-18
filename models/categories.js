const mongoose = require('mongoose');

//article schema

const categoriesSchema = mongoose.Schema({
    name:[{
        ka:{
            type:String,
            required: true
        },
        ru:{
            type:String,
            required: false
        },
        en:{
            type:String,
            required: false
        }
    }],
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