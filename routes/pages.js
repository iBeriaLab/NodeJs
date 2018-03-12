const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Articles Model
const Page = require('../models/pages');
//User Model
const User = require('../models/user');

//home route
router.get('/', function(req, res){
    Page.find({}, function(err, pages){
        if(err){
            console.log(err);
        } else{
            res.render('pages/index', {
                title: 'Pages',
                pages: pages
            });
        }
    });
});

// Get Add Articles Page
router.get('/add', ensureAuthenticated, function(req, res, next){
    res.render('pages/add_page', {
        title: 'Add Page'
    });
});

// Add articles post request
router.post('/add', function(req, res, next){
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    let dateString = Date();
    dateString = new Date(dateString).toUTCString();
    dateString = dateString.split(' ').slice(0, 4).join(' ')

    //get errors
    const errors = req.validationErrors();

    if(errors){
        res.render('pages/add_page',{
            title: 'Add Page',
            errors:errors
        });
    }else{
        const page = new Page();
        page.title = req.body.title;
        page.slug = req.body.slug;
        page.author = req.user._id;
        page.body = req.body.body;
        page.structure = req.body.structure;
        page.date = dateString;

        page.save(function(err){
            if(err){
                console.log(err);
            } else{
                req.flash('success','Page Added');
                res.redirect('/pages');
            }
        });
    }
});

// Get Single Page
router.get('/:id', function(req, res, next){
    Page.findById(req.params.id, function(err, page){
      res.render('pages/page', {
          page: page
      });
    });
});

// Load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Page.findById(req.params.id, function(err, page){
        if(page.author != req.user._id){
            req.flash('danger','Not Authorized');
            res.redirect('/');
        }
        res.render('pages/edit_page', {
            title:'Edit Page',
            page: page
        });
    });
});

// Update Pages post request
router.post('/edit/:id', function(req, res, next){
    const page = {};
    page.title = req.body.title;
    page.slug = req.body.slug;
    page.author = req.body.author;
    page.body = req.body.body;
    page.structure = req.body.structure;

    const query = {_id:req.params.id};

    Page.update(query, page, function(err){
        if(err){
            console.log(err);
        } else{
            req.flash('success','Page Updated');
            res.redirect('/pages');
        }
    });
});

//Delete Page
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    const query = {_id:req.params.id}

    Page.findById(req.params.id, function(err, page){
        if(page.author != req.user._id){
            res.status(500).send();
        } else {
            Page.remove(query, function(err){
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
