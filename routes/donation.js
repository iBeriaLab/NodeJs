const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_Wg5POm9bRbv5pwPxizhp8WXZ');


//User Model
const User = require('../models/user');

//Donation Model
const Donation = require('../models/donation');

//donation main route
router.get('/',ensureAuthenticated, function(req, res){
    res.render('donation/index', {
        title: 'შემოწირულობა'
    });
});

//donation post routre
router.post('/step/two', function(req, res){
    res.render('donation/steptwo', {
        amount: req.body.amount * 100,
        email: req.body.email//req.user.email,
    });
});



//donation callback get
router.get('/callback', function(req, res){

});

//donation callback post
router.post('/callback', function(req, res){
    // const amount = 1000;
    // console.log(req.body);
    // res.send('test');
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
    }).then(customer => stripe.charges.create({
        amount: req.body.amount,
        description:'გადარიცხვა',
        currency:'usd',
        customer:customer.id
    })).then(charge => res.render('donation/success'));
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
