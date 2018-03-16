const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//User Model
const User = require('../models/user');

//donation main route
router.get('/', function(req, res){
    res.render('contact/index', {
        title: 'კონტაქტი'
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