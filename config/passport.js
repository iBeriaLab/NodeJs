const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

//Models
const User = require('../models/user');

//database
const config = require('../config/database');
const configAuth = require('./auth');

//bcrypt
const bcrypt = require('bcryptjs');

module.exports = function(passport){

//Local Strategy
    passport.use(new LocalStrategy(function(username, password, done){
        //Match Email
        const query = {username:username};
        User.findOne(query, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'No user found'});
            }
            //Match Password
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));

//facebook Strategy
passport.use(new FacebookStrategy({
    clientID: configAuth.facebook.clientID,
    clientSecret: configAuth.facebook.clientSecret,
    callbackURL: configAuth.facebook.callbackURL,
    profileFields: ['id', 'name', 'displayName', 'picture.type(large)', 'locale', 'profileUrl', 'email', 'birthday', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {
    //console.log(profile.emails[0].value)
    process.nextTick(function(){
        User.findOne({facebookId: profile.id}, function(err, user){
            if(err)
                return done(err);
            if(user)
                return done(null, user);
            else {
                var newUser = new User();
                newUser.facebookId = profile.id;
                newUser.token = accessToken;
                newUser.firstName = profile.name.givenName;
                newUser.lastName = profile.name.familyName;
                newUser.birthday = profile.birthday;
                newUser.gender = profile.gender;
                newUser.hometown = profile.locale;
                newUser.facebookURL = profile.profileUrl;
                newUser.email = profile.emails[0].value;
                newUser.username = profile.name.givenName + profile.name.familyName;
                newUser.avatar = profile.photos ? profile.photos[0].value : '../uploads/avatars/avatar.png';//profile.photos[0].value;
                //damatebiti
                newUser.isAdmin = false;

                newUser.save(function(err){
                    if(err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    });
  }));

//------
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}