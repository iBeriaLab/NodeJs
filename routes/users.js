const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User Model
const User = require('../models/user');

//Register Form
router.get('/register', function(req, res){
    res.render('auth/register',{
        title: 'რეგისტრაცია',
    });
});

//Register Proccess
router.post('/register', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const isAdmin = false;
    const avatar = '../uploads/avatars/avatar.png';
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    let dateString = Date();
    dateString = new Date(dateString).toUTCString();
    dateString = dateString.split(' ').slice(0, 4).join(' ')

    req.checkBody('firstName', 'Firstname is required').notEmpty();
    req.checkBody('lastName', 'Lastname is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if(errors){
        res.render('auth/register', {
            errors:errors
        });
    } else {
        const newUser = new User({
            firstName:firstName,
            lastName:lastName,
            isAdmin:isAdmin,
            avatar:avatar,
            email:email,
            username:username,
            password:password,
            date:dateString
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

//Login Form
router.get('/login', function(req, res){
    res.render('auth/login',{
        title: 'ავტორიზაცია',
    });
});

//Login Proccess
router.post('/login', function(req, res, next){
    passport.authenticate('local', 
        {   
            successRedirect: '/',
            failureRedirect: '/users/login',
            failureFlash: true 
        })(req, res, next);
});

//Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

// Profile Page
router.get('/:username', ensureAuthenticated, function(req,res){
    res.render('auth/profile', {
        title: 'User Profile'
    });
});

//Facebook Login Routes
router.get('/auth/facebook',
    passport.authenticate('facebook', {scope: ['email']}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res){
        res.redirect('/');
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