const express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/*GET register page */

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', (req, res) => {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;

   // console.log(`${name}, ${email}, ${username}, ${password}`);
   //Validation

   req.checkBody('name','Name is required').notEmpty();
   req.checkBody('email','Email is required').notEmpty();
   req.checkBody('email', 'Email is not valid').isEmail();
   req.checkBody('username','username is required').notEmpty();
   req.checkBody('password','password is required').notEmpty();
   req.checkBody('cpassword','passwords do not match').equals(req.body.password);
   var errors = req.validationErrors();
   if(errors)
   {
       res.render('register', {
           errors: errors
       });
   }
   else
   {
      var newUser = new User({
          name:name,
          email:email, 
          username:username,
          password:password
      });

      User.createUser(newUser, (err,user) => {
            if(err) throw err;
            console.log(user);
      });
      req.flash('success_msg','You are registered and can login now');
      res.redirect('/users/login');
   }
});
passport.use(new LocalStrategy((username,password,done) =>{
    User.getUserByUsername(username, (error,user) => {
        if(error) throw error;
        if(!user)
        {
            return done(null,false, {message:'Unknown user'});
        }
        User.comparePassword(password,user.password, (error,isMatch) => {
            if(error) throw error;
            if(isMatch)
            {
                return done(null,user);
            }
            else {
                return done(null,false, {message: 'Invalid password'});
            }
        });  
    });
}));
passport.serializeUser((user,done) => {
    done(null,user.id);
});
passport.deserializeUser((id,done) => {
    User.getUserById(id, (error,user) => {
        done(error,user);
    }); 
});

router.post('/login', 
passport.authenticate('local', {successRedirect : '/', failureRedirect : '/users/login', 
failureFlash : true}),(req,res) => {
    res.redirect('/');
});
router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;