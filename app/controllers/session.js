'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');


var Client = require('node-rest-client').Client;

var client = new Client();


var https = require('https');

var request = require('request');
/**
 * Logout
 */
exports.logout = function (req, res) {
    req.logout();
    //console.log('Logout Requested');
    res.send(200);
};

/**
 * Login
 */
exports.loginToPlanner = function (req, res, next) {
    console.log("[LOGIN v1] Email = "+req.body.email);


        User.findOne({
                email: req.body.email
            }, function (err, localUser) {
                if (err) return done(err);
                if (!localUser) {
                    return res.json(400, {message: 'User not found'});
                }
                req.logIn(localUser, function (err) {
                    if (err) return res.send(err);

                    var userInfo = localUser.userInfo;
		    console.log(localUser);
                    res.json(localUser);
                });	
	});
};

/*exports.login = function (req, res, next) {
    console.log('[LOGIN] Started');
	console.log(req.body);
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            //console.log('[LOGIN v1] Local Authentication FAILED');
            return res.json(401, error);
        }
            
    })(req, res, next);
};*/
