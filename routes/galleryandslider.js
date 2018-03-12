const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');

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
            next(null,'./public/uploads/gallery');
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
const galleryCategory = require('../models/galleryCategory');
//User Model
const User = require('../models/user');

const multerPhotosConf = {
    storage: multer.diskStorage({
        destination: function(req, file, next){
            Gallery.findById(req.params.id, function(err, gallery){
                console.log(gallery.title)
                next(null,'./public/uploads/gallery/' + gallery.title + '/');
            })
        },
        filename: function(req, file, next){
            next(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            //console.log(file);
        }
    })
};

//gallery home route
router.get('/gallery', function(req, res){
    Gallery.find({}, function(err, galleries){
        if(err){
            console.log(err);
        } else{
            res.render('gallery/index', {
                title: 'გალერეა',
                galleries: galleries
            });
        }
    });
});

// Get Add Articles Page
router.get('/gallery/add', ensureAuthenticated, function(req, res, next){
    // res.render('articles/add_article', {
    //     title: 'სიახლის დამატება'
    // });
    galleryCategory.find({}, function(err, categories){
        if(err){
            console.log(err);
        } else{
            res.render('gallery/add_gallery', {
                title: 'ალბომის დამატება'
            });
        }
    });
});

// Add articles post request
router.post('/gallery/add', multer(multerConf).single('cover'), function(req, res, next){
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    //req.checkBody('category','Category is required').notEmpty();
    req.checkBody('description','Description is required').notEmpty();

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
        res.render('gallery/add_gallery',{
            title: 'Add Gallery',
            errors:errors
        });
    }else{
        const gallery = new Gallery();
        gallery.title = req.body.title;
        gallery.description = req.body.description;
        gallery.cover = req.file.filename;
        gallery.date = {
            year: dateString.getFullYear(),
            month: month[dateString.getMonth()],
            weekday: weekday[dateString.getDay()],
            day: dateString.getDate(),
            clock: dateString.getHours() + ':' + dateString.getMinutes() + ':' + dateString.getSeconds()
        };

        gallery.save(function(err){
            if(err){
                console.log(err);
            } else{
                mkdirp('./public/uploads/gallery/' + gallery.title, function (err) {
                    if (err) console.error(err)
                    else console.log('pow!')
                });
                req.flash('success','Gallery Added');
                res.redirect('/');
            }
        });
    }
});

// Get Single article
router.get('/gallery/:id', function(req, res, next){
    Gallery.findById(req.params.id, function(err, gallery){
        res.render('gallery/gallery', {
            gallery: gallery
        });
    });
});


// Update articles post request
router.post('/gallery/add/photo/:id',multer(multerPhotosConf).single('photo'), function(req, res, next){
    const gallery = {};
    // let Stringdate = Date();
    // dateString = new Date(Stringdate);

    // var month = new Array();
    // month[0] = "იანვარი";
    // month[1] = "თებერვალი";
    // month[2] = "მარტი";
    // month[3] = "აპრილი";
    // month[4] = "მაისი";
    // month[5] = "ივნისი";
    // month[6] = "ივლისი";
    // month[7] = "აგვისტო";
    // month[8] = "სექტემბერი";
    // month[9] = "ოქტომბერი";
    // month[10] = "ნოემბერი";
    // month[11] = "დეკემბერი";

    // var weekday = new Array(7);
    // weekday[0] =  "კვირა";
    // weekday[1] = "ორშაბათი";
    // weekday[2] = "სამშაბათი";
    // weekday[3] = "ოთხშაბათი";
    // weekday[4] = "ხუთშაბათი";
    // weekday[5] = "პარასკევი";
    // weekday[6] = "შაბათი";

    // gallery.title = req.body.title;
    // gallery.description = req.body.description;
    // gallery.cover = req.file.filename;
    // gallery.date = {
    //     year: dateString.getFullYear(),
    //     month: month[dateString.getMonth()],
    //     weekday: weekday[dateString.getDay()],
    //     day: dateString.getDate(),
    //     clock: dateString.getHours() + ':' + dateString.getMinutes() + ':' + dateString.getSeconds()
    // };
    gallery.photos = req.body.photo;

    const query = {_id:req.params.id};

    Gallery.findOne(query).exec(function(err, gallery){
        gallery.photos.push(req.file.filename);
        gallery.save(function (err, photo){
            if (err) throw err;
            console.log('Photo Added!');
            console.log(req.params.id);
            res.redirect('/photos/gallery/'+req.params.id);
        });
        //console.log(req.file.filename);
    });
        
    // Gallery.update(query, gallery, function(err){
    //     photos: req.body.photos;
    //         req.flash('success','Article Updated');
    //         res.redirect('/gallery/:id');
    // });
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
    galleryCategory.find({}, function(err, categories){
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
    galleryCategory.find({}, function(err, categories){
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
    galleryCategory.findById(req.params.id, function(err, category){
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

    galleryCategory.findById(req.params.id, function(err, category){
        if(!req.user.isAdmin){
            res.status(500).send();
        } else {
            galleryCategory.remove(query, function(err){
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