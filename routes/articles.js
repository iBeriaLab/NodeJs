const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const ars = require('arslugify');

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
            next(null,'./public/uploads/posts');
        },
        filename: function(req, file, next){
            next(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            //console.log(file);
        }
    }),
};
  
//var upload = multer({ storage: storage }).single('poster');

//Articles Model
const Article = require('../models/articles');
//Articles Model
const Category = require('../models/categories');
//User Model
const User = require('../models/user');
//Gallery Model
const Gallery = require('../models/gallery');


//poster upload

// router.post('/poster/up', multer(multerConf).single('poster'), function(req, res){
//    if(req.file){
//        console.log(req.file);
//    }
// });

//home route
router.get('/', function(req, res){
    Article.find({}).sort('-created').exec(function(err, articles){
        Category.find({}, function(err, categories){
            if(err){
                console.log(err);
            } else{
                Article.count(function(err, c) {
                    res.render('articles/index', {
                        title: 'სიახლეები',
                        articles: articles,
                        categories: categories,
                        count:c
                    });
               });
            }
        });
    });
});

// Get Add Articles Page
router.get('/add', ensureAuthenticated, function(req, res, next){
    // res.render('articles/add_article', {
    //     title: 'სიახლის დამატება'
    // });
    Category.find({}, function(err, categories){
        if(err){
            console.log(err);
        } else{
            Gallery.find({}, function(err, gallery){
                if(err){
                    console.log(err);
                } else{
                    res.render('articles/add_article', {
                        title: 'სიახლის დამატება',
                        categories: categories,
                        gallery:gallery
                    });
                }
            });
        }
    });
});

// Add articles post request
router.post('/add', multer(multerConf).single('poster'), function(req, res, next){
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('category','Category is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    let Stringdate = Date();
    dateString = new Date(Stringdate);

    var month = new Array();
    month[0] = "იანვარი";
    month[1] = "თებერვალი";
    month[2] = "მარტი";
    month[3] = "აპრილი";
    month[4] = "მაისი";
    month[5] = "ივნისი";
    month[6] = "ივლისი";
    month[7] = "აგვისტო";
    month[8] = "სექტემბერი";
    month[9] = "ოქტომბერი";
    month[10] = "ნოემბერი";
    month[11] = "დეკემბერი";

    var weekday = new Array(7);
    weekday[0] =  "კვირა";
    weekday[1] = "ორშაბათი";
    weekday[2] = "სამშაბათი";
    weekday[3] = "ოთხშაბათი";
    weekday[4] = "ხუთშაბათი";
    weekday[5] = "პარასკევი";
    weekday[6] = "შაბათი";

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
        article.slug = ars(req.body.title);
        article.category = req.body.category;
        article.poster = req.file.filename;
        article.author = req.user._id;
        article.body = req.body.body;
        article.gallery = req.body.gallery;
        article.date = {
            year: dateString.getFullYear(),
            month: month[dateString.getMonth()],
            weekday: weekday[dateString.getDay()],
            day: dateString.getDate(),
            clock: dateString.getHours() + ':' + dateString.getMinutes() + ':' + dateString.getSeconds(),
            created: new Date()
        };

        article.save(function(err){
            if(err){
                console.log(err);
            } else{
                req.flash('success','სტატია წარმატებით დაემატა');
                res.redirect('/articles');
            }
        });
    }
});

// Get Single article
router.get('/:slug', function(req, res, next){
    //let slug =  {"slug" : "article-test-title"}
    Article.find({"slug" : req.params.slug}, function(err, article){
        //console.log(article[0].title);
        User.findById(article[0].author, function(err, user){
            Category.find({}, function(err, categories){
                Gallery.findById(article[0].gallery, function(err, gallery){
                    res.render('articles/article', {
                        article: article[0],
                        author: user.firstName + ' ' + user.lastName,
                        gallery:gallery,
                        categories:categories
                    });
                });
            });
        });
    });
});
// // Get Single article
// router.get('/:id', function(req, res, next){
//     Article.findById(req.params.id, function(err, article){
//         User.findById(article.author, function(err, user){
//             Gallery.findById(article.gallery, function(err, gallery){
//                 res.render('articles/article', {
//                     article: article,
//                     author: user.firstName + ' ' + user.lastName,
//                     gallery:gallery
//                 });
//             });
//         });
//     });
// });

// Load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Article.findById(req.params.id, function(err, article){
        if(!req.user.isAdmin){
            req.flash('danger','Not Authorized');
            res.redirect('/');
        }
        Category.find({}, function(err, categories){
            Gallery.find({}, function(err, gallery){
                if(err){
                    console.log(err);
                } else{
                    res.render('articles/edit_article', {
                        title: 'სიახლის დამატება',
                        categories: categories,
                        article: article,
                        gallery:gallery
                    });
                }
            });
        });
        // res.render('articles/edit_article', {
        //     title:'Edit Article',
        //     article: article
        // });
    });
});

// Update articles post request
router.post('/edit/:id', multer(multerConf).single('poster'), function(req, res, next){
    const article = {};
    article.title = req.body.title;
    article.slug = ars(req.body.title);
    article.category = req.body.category;
    //article.poster = req.file.filename;
    article.author = req.user._id;
    article.body = req.body.body;
    article.gallery = req.body.gallery;

    const query = {_id:req.params.id};

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash('success','Article Updated');
            res.redirect('/articles');
            console.log(req.file);
        }
    });
});

//Delete article
router.delete('/:id', function(req, res){
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
router.get('/categories', function(req, res){
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
router.get('/categories/add', ensureAuthenticated, function(req, res, next){
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
router.post('/categories/add', multer(multerConf).single('poster'), function(req, res, next){
    req.checkBody('name','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('icon','Body is required').notEmpty();

    let dateString = Date();
    dateString = new Date(dateString).toUTCString();

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
        category.name = ars(req.body.name);
        category.icon = req.body.icon;
        category.parent = req.body.parent;
        category.date = dateString;

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
router.get('/category/:slug', function(req, res, next){
    //let slug =  {"slug" : "article-test-title"}

    Category.find({"slug" : req.params.slug}, function(err, category){
        //console.log(category[0].slug);
        Article.find({"category": category[0].slug}, function(err, articles){
            Category.find({}, function(err, categories){
                res.render('articles/categories/category', {
                    category:category,
                    articles: articles,
                    categories:categories
                });
            });
            //console.log(articles);
        });
    });

});

// Load edit form article Categories
router.get('/categories/edit/:id', ensureAuthenticated, function(req, res){
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
router.post('/categories/edit/:id', function(req, res, next){
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
router.delete('/categories/:id', function(req, res){
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