'use strict;'

var mongoose = require('mongoose'),
    Planner = mongoose.model('Planner'),
    rest = require('../others/restware'),
    _ = require('lodash');

/**
 * List of Alerts for the criteria
 */


function getPlans(collection, userId, cb) {
    var criteria = {};

    criteria['user_id'] = userId;
    //criteria['p_date'] = new Date(rdate);

    //console.log(new Date(rdate));
    console.log(userId);

    collection.find(criteria)
	.sort({_id: -1})
        .exec(function(err, tplan) {
            cb(err,tplan);
    })
}

exports.getPlan = function(req, res) {
    var id,rdate;
    id = req.params['userId'];
    
    getPlans(Planner, id,function(err,planner){
	console.log(planner);
        if (err)
            return rest.sendError(res,'Unable to retrieve alerts',err);
        else {
           return rest.sendSuccess(res,'Sending direct alerts list for the user', planner);
        }
    })
}

exports.savePlan = function(req, res) {
	console.log(req.body);
	var localData = new Planner(req.body);
	localData.save(function(err,data) {
        if (err) {
			return res.json(400, err);
		}
	res.json(200, 'Plan has been saved');
});
}
