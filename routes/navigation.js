const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ars = require('arslugify');

//Articles Model
const Nav = require('../models/navigations');
//Articles Model
const Page = require('../models/pages');

//home route
router.get('/',ensureAuthenticated, function(req, res){
    Nav.find({}, function(err, navigations){
        Page.find({}, function(err, pages){
            Nav.find({"parent" : navigations[2].parent}, function(err, child){
                //console.log(article[0].title);
                if(err){
                    console.log(err);
                } else{
                    res.render('navigation/index', {
                        title: 'ნავიგაცია',
                        navigations:navigations,
                        pages:pages,
                        child:child
                    });
                    console.log(child);
                }
            });
            // if(err){
            //     console.log(err);
            // } else{
            //     res.render('navigation/index', {
            //         title: 'ნავიგაცია',
            //         navigations:navigations,
            //         pages:pages
            //     });
            // }
        });
    });
});

// Add articles post request
router.post('/', function(req, res, next){
    // req.checkBody('title','Title is required').notEmpty();
    // //req.checkBody('author','Author is required').notEmpty();
    // req.checkBody('category','Category is required').notEmpty();
    // req.checkBody('body','Body is required').notEmpty();

    //get errors
    const errors = req.validationErrors();

    if(errors){
        res.render('navigation/index',{
            title: 'ნავიგაცია',
            errors:errors
        });
    }else{
        const navigation = new Nav();
        navigation.title = req.body.title;
        navigation.url = req.body.url;
        navigation.parent = req.body.parent;
        navigation.icon = req.body.icon;

        navigation.save(function(err){
            if(err){
                console.log(err);
            } else{
                req.flash('success','ნავიგაცია წარმატებით დაემატა');
                res.redirect('/navs');
            }
        });
    }
});

//Delete nav
router.delete('/:id', function(req, res){
    // if(!user.isAdmin){
    //     res.status(500).send();
    // }

    const query = {_id:req.params.id}

    Nav.findById(query, function(err, navigations){
        if(!req.user.isAdmin){
            res.status(500).send();
        } else {
            Nav.remove(query, function(err){
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
