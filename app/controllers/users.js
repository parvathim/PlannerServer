'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    rest = require('../others/restware'),
    _ = require('lodash');

mongoose.Promise = Promise;

//var feed = require('./feed');

/**
 * Create user
 */
exports.create = function (req, res, next) {

    // DEPRECATED API
    //res.json(400, 'API DEPRECATED. Use v2 APIs Instead');
    console.log('create');
    var newUser = new User(req.body);
    //newUser.provider = 'local';
    //password = password.toString('base64');

    newUser.password = new Buffer(newUser.password).toString('base64');
    newUser.save(function(err,data) {
        if (err) {
            // Manually provide our own message for 'unique' validation errors, can't do it from schema
           // if(err.errors.email.type === 'Value is not unique.') {
             //   err.errors.email.type = 'The specified email address is already in use.';
            //}
            console.log(err);
            return res.json(400, err);
        }

        data.save();

        req.logIn(newUser, function(err) {
            if (err) return next(err);

            return res.json(req.user.userInfo);
        });
    });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
    var userId = req.params.userid;

    User.findById(userId, function (err, user) {
        if (err) 
	{
		console.log(err);
		return rest.sendError(res,'Unable to retrieve User',err);
	}
        else {
	    console.log(user);
            return rest.sendSuccess(res,'Sending group details for the user', user);
        } 
    });
};

/**
 * Save details
 */
exports.updateMyRecords = function(req, res, next) {
    var userId = req.params.userid;


    User.findById(userId, function (err, user) {
        user = _.extend(user, req.body)
        user.save(function (err,data) {
            if (err)
                return rest.sendError(res,'Unable to update User',err);
            return rest.sendSuccess(res,'updated User details',data);
        });
    });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
    console.log(JSON.stringify(req.user));
    res.json(req.user || null);
};
