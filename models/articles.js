const mongoose = require('mongoose');

//article schema

const articleSchema = mongoose.Schema({
    title:[{
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
    body:[{
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
        },
        created:{
            type: Date
        }
    },
    gallery:{
        type:String,
        require:false
    }
});

const Article = module.exports = mongoose.model('Article', articleSchema);