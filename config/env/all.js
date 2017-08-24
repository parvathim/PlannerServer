'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    viewDir: rootPath + '/app/views',
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },
    session: {
        secret: 'planner'
    }
};
