const express = require('express'),
        cookieParser = require('cookie-parser'),
        i18n = require('i18n'),
        app = module.exports = express();
//const cookieParser = require('cookie-parser')
const BodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
const db = mongoose.connection;


i18n.configure({

    //define how many languages we would support in our application
    locales:['ka', 'ru', 'en'],
    
    //define the path to language json files, default is /locales
    directory: __dirname + '/locales',
    
    //define the default language
    defaultLocale: 'ka',
    
    // define a custom cookie name to parse locale settings from 
    cookie: 'i18n'
    });


app.use(cookieParser("i18n_demo"));

app.use(session({
    secret: "i18n_demo",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(i18n.init);



//check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//check for DB errors
db.on('error', function(err){
    console.log(err);
});

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Midlleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

//Express Messages Middleware
app.use(require('connect-flash')());


app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    res.cookie('ka',{ maxAge: 900000, httpOnly: true });
    lang = req.cookies.i18n;
    next();
});

app.getDelay = function (req, res) {
    return url.parse(req.url, true).query.delay || 0;
};

//start server
const port = 5000;
app.listen(port, function(){
    console.log('Server start on port', port)
});

//Routes
const articlesRoutes = require('./routes/articles');
const pagesRoutes = require('./routes/pages');
const navsRoutes = require('./routes/navigation');
const usersRoutes = require('./routes/users');
const donationRoutes = require('./routes/donation');
const photosRoutes = require('./routes/galleryandslider');
const contactRoutes = require('./routes/contact');
app.use('/articles', articlesRoutes);
app.use('/pages', pagesRoutes);
app.use('/navs', navsRoutes);
app.use('/users', usersRoutes);
app.use('/donation', donationRoutes);
app.use('/photos', photosRoutes);
app.use('/contact', contactRoutes);

//Gallery Model
const Gallery = require('./models/gallery');
//Articles Model
const Nav = require('./models/navigations');

app.get('/', function(req, res){
    Gallery.find({}, function(err, galleries){
        if(err){
            console.log(err);
        } else{
            res.render('index', {
                title: 'მთავარი გვერდი',
                galleries: galleries
            });
            res.setLocale('ka');
            console.log(req.cookies.i18n);
            console.log(req.ip);
        }
    });
});

app.get('/ka', function (req, res) {
    res.cookie('i18n', 'ka');
    res.redirect(req.get('referer'));
});

app.get('/ru', function (req, res) {
    res.cookie('i18n', 'ru');
    res.redirect(req.get('referer'));
});

app.get('/en', function (req, res) {
    res.cookie('i18n', 'en');
    res.redirect(req.get('referer'));
});