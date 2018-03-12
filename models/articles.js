const mongoose = require('mongoose');

//article schema

const articleSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    poster:{
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

const Article = module.exports = mongoose.model('Article', articleSchema);