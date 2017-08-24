'use strict';

module.exports = {
  env: 'production',
  https: false,
  port: process.env.PORT || 2000,
  mongo: {
    uri: 'mongodb://localhost/planserv'
  }
};
