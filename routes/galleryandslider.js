const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

//Uploads Storage
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/public/uploads/posts')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
//   });

const multerConf = {
    storage: multer.diskStorage({
        destination: function(req, file, next){
            next(null,'./public/uploads/photos');
        },
        filename: function(req, file, next){
            next(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            //console.log(file);
        }
    }),
};
  
//var upload = multer({ storage: storage }).single('poster');
//Slider Model
const Slider = require('../models/slider');
//Gallery Model
const Gallery = require('../models/gallery');
//Gallery Model
const Category = require('../models/galleryCategory');
//User Model
const User = require('../models/user');


//gallery home route
router.get('/gallery', function(req, res){
    Gallery.find({}, function(err, articles){
        if(err){
            console.log(err);
        } else{
            res.render('articles/index', {
                title: 'სიახლეები',
                articles: articles
            });
        }
    });
});

// Get Add Articles Page
router.get('/gallery/add', ensureAuthenticated, function(req, res, next){
    // res.render('articles/add_article', {
    //     title: 'სიახლის დამატება'
    // });
    Category.find({}, function(err, categories){
        if(err){
            console.log(err);
        } else{
            res.render('articles/add_article', {
                title: 'სიახლის დამატება',
                categories: categories
            });
        }
    });
});

// Add articles post request
router.post('/gallery/add', multer(multerConf).single('poster'), function(req, res, next){
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('category','Category is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //get errors
    const errors = req.validationErrors();

    if(errors){
        res.render('articles/add_article',{
            title: 'Add Article',
            errors:errors
        });
    }else{
        const article = new Article();
        article.title = req.body.title;
        article.category = req.body.category;
        article.poster = req.file.filename;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save(function(err){
            if(err){
                console.log(err);
            } else{
                req.flash('success','Article Added');
                res.redirect('/articles');
            }
        });
    }
});

// Get Single article
router.get('/:id', function(req, res, next){
    Article.findById(req.params.id, function(err, article){
        User.findById(article.author, function(err, user){
            res.render('articles/article', {
                article: article,
                author: user.firstName + ' ' + user.lastName
            });
        });
    });
});

// Load edit form
router.get('/gallery/edit/:id', ensureAuthenticated, function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(article.author != req.user._id){
            req.flash('danger','Not Authorized');
            res.redirect('/');
        }
        Category.find({}, function(err, categories){
            if(err){
                console.log(err);
            } else{
                res.render('articles/edit_article', {
                    title: 'სიახლის დამატება',
                    categories: categories,
                    article: article
                });
            }
        });
        // res.render('articles/edit_article', {
        //     title:'Edit Article',
        //     article: article
        // });
    });
});

// Update articles post request
router.post('/gallery/edit/:id', function(req, res, next){
    const article = {};
    article.title = req.body.title;
    article.category = req.body.category;
    article.author = req.body.author;
    article.body = req.body.body;

    const query = {_id:req.params.id};

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash('success','Article Updated');
            res.redirect('/articles');
        }
    });
});

//Delete article
router.delete('/gallery/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    const query = {_id:req.params.id}

    Article.findById(req.params.id, function(err, article){
        if(article.author != req.user._id){
            res.status(500).send();
        } else {
            Article.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
        // Article.remove(query, function(err){
        //     if(err){
        //         console.log(err);
        //     }
        //     res.send('Success');
        // });
    });
});


//Article Categories

//Categories home route
router.get('/gallery/categories', function(req, res){
    Category.find({}, function(err, categories){
        if(err){
            console.log(err);
        } else{
            res.render('articles/categories/index', {
                title: 'კატეგორიები',
                categories: categories
            });
        }
    });
});

// Get Add Article Categories Page
router.get('/gallery/categories/add', ensureAuthenticated, function(req, res, next){
    // res.render('articles/categories/add_category', {
    //     title: 'კატეგორიის დამატება'
    // });
    Category.find({}, function(err, categories){
        if(err){
            console.log(err);
        } else{
            res.render('articles/categories/add_category', {
                title: 'კატეგორიის დამატება',
                categories: categories
            });
        }
    });
});

// Add article Categories post request
router.post('/gallery/categories/add', multer(multerConf).single('poster'), function(req, res, next){
    req.checkBody('name','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('icon','Body is required').notEmpty();

    //get errors
    const errors = req.validationErrors();

    if(errors){
        res.render('articles/categories/add_category',{
            title: 'Add Category',
            errors:errors
        });
    }else{
        const category = new Category();
        category.name = req.body.name;
        category.icon = req.body.icon;
        category.parent = req.body.parent;

        category.save(function(err){
            if(err){
                console.log(err);
            } else{
                req.flash('success','Category Added');
                res.redirect('/articles');
            }
        });
    }
});

// Get Single article Categories 
router.get('/gallery/categories/:id', function(req, res, next){
    // Article.findById(req.params.id, function(err, category){
    //     User.findById(category.author, function(err, user){
    //         res.render('articles/categories/category', {
    //             category: category
    //         });
    //     });
    // });
});

// Load edit form article Categories
router.get('/gallery/categories/edit/:id', ensureAuthenticated, function(req, res){
    Category.findById(req.params.id, function(err, category){
        if(!req.user.isAdmin){
            req.flash('danger','Not Authorized');
            res.redirect('/');
        }
        res.render('articles/categories/edit_category', {
            title:'Edit Category',
            category: category
        });
    });
});

// Update article Categories post request
router.post('/gallery/categories/edit/:id', function(req, res, next){
    const category = {};
    category.name = req.body.name;
    category.icon = req.body.icon;
    category.parent = req.body.parent;

    const query = {_id:req.params.id};

    Category.update(query, category, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash('success','Category Updated');
            res.redirect('/articles/categories');
        }
    });
});

//Delete article Categorie
router.delete('/gallery/categories/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    const query = {_id:req.params.id}

    Category.findById(req.params.id, function(err, category){
        if(!req.user.isAdmin){
            res.status(500).send();
        } else {
            Category.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});





//Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;