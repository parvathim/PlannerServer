'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
 //   StormpathStrategy = require('passport-stormpath');

    // For Stormpath
//var spStrategy = new StormpathStrategy({
  //          usernameField: 'email',
    //        passwordField: 'password'
      //  } );

/**
 * Passport configuration
 */
module.exports = function () {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
            done(err, user);
        });
    });

    // Local Strategy;
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password' // this is the virtual field on the model
        },
        function (email, password, done) {
            User.findOne({
                email: email
            }, function (err, user) {
                if (err) return done(err);

                if (!user) {
                    return done(null, false, {
                        message: 'This email is not registered.'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Incorrect Password.'
                    });
                }
                return done(null, user);
            });
        }
    ));
    console.log("[PASSPORT CONFIG] Passport Configured with Local Strategy");

    // Stormpath Strategy
    //passport.use(spStrategy);
   // console.log("[PASSPORT CONFIG] Passport Configured with Stormpath Strategy");
    

    
};
