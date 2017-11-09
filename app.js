const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const hbs = require('hbs');
//connecting to a local database name loginapp
mongoose.connect('mongodb://localhost:27017/loginapp');
var db = mongoose.connection;
//creating routes
var routes = require('./routes/index');
var users = require('./routes/users');
//initializing app
var app = express();
//view engine
app.set('views',path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout : 'layout'}));
app.set('view engine', 'handlebars');
//bodyparser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
app.use(cookieparser());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session

app.use(session({
    secret : 'secret',
    saveUninitialized : true,
    resave : true
}));

// Passport 
app.use(passport.initialize());
app.use(passport.session());

//Express validator

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
 
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,      
        value : value
      };
    }
}));

//Connect flash

app.use(flash());

app.use(function(req,res,next)
{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();

});

//routes file

app.use('/',routes);
app.use('/users',users);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Started on port: ${port}`);
});

//module.exports = app;




