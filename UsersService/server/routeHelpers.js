var jwtDecode = require('jwt-decode');
var jwt = require('jsonwebtoken')

var secret = require('../config/config.js');
var dbHelpers = require('../db/helpers.js');


var routeHelpers = {
  parseTokenError: function(err, token, callback) {
    if (err.message === "jwt expired" || err.message === "invalid token") {
      callback({isValid: false});
    } else {
      callback(null, {isValid: true});
    }
  },

  verifyToken: function(token, callback) {
    jwt.verify(token, secret, (err, success) => {
      if (err) {
        console.log('routeHelpers -> verifyToken', err);
        // this.parseTokenError(err, token, callback);
        callback(err);
      } else {
        callback(null, success);
      }
    });
  },

  getUserProfile: function(profile, callback) {
    dbHelpers.findUser(profile, (err, success) => {
      if (err) {
        console.log('routeHelpers -> addUser', err)
      } else {
        callback(null, success);
      }
    })
  }

}

module.exports = routeHelpers;