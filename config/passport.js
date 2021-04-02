var passport =  require('passport');
var User = require('../model/user');
var LocalStrategy = require('passport-local').Strategy;
//console.log("Hii2312323");
passport.serializeUser(function (user, done) {
    done(null, user.id);
  //  console.log("se");
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    //    console.log("des");
    });  
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, function (req, email, password, done) {

    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
    var errors=req.validationErrors();
    if(errors){
        var messages=[]; 
        errors.forEach(function(error){
messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }
  
  //  req.checkBody('email','Invalid Email').notEmpty().isEmail();
   // req.checkBody('password','invalid Pasword').notEmpty().isLength({min:4});
  //  var errors=req.validationErrors()
  /*  if();
    )*/
    console.log(email);
    User.findOne({'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Email is alerady in use.' });
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if (err) {
                return done(err)
            }
            return done(null, newUser);
        });
    });
}));
passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done ){
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty();
    var errors=req.validationErrors();
    if(errors){
        var messages=[]; 
        errors.forEach(function(error){
messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }
    User.findOne({'email': email }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'No User Found.' });
        }
        if(!user.validPassword(password)){
            return done(null,false,{message:'In`Valid Password'});
             
        }
        return done(null,user);/*
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if (err) {
                return done(err)
            }
            return done(null, newUser);
        });*/
    });

  
}));