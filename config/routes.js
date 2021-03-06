'use strict';

var index   = require('../app/controllers/index'),
    planner   = require('./../app/controllers/planner'),
    session   = require('./../app/controllers/session'),
    users   = require('./../app/controllers/users');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

    app.post('/api/users', users.create); 
    app.post('/api/users/:userid',middleware.auth, users.updateMyRecords); 
    app.get('/api/users/:userid',middleware.auth, users.show);  
    app.get('/api/users/me',middleware.auth, users.me);  

    app.post('/api/plan',middleware.auth, planner.savePlan); 
    app.get('/api/plan/:userId',middleware.auth, planner.getPlan);  

    app.post('/api/session', session.loginToPlanner); // Authenticate: SP Strategy, Create Session in CareBook.
    app.del('/api/session', session.logout); // Unchanged

    app.get('/partials/*', index.partials);
    
    app.get('/*', middleware.setUserCookie, index.index);

};
