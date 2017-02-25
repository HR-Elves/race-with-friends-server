var jwtDecode = require('jwt-decode');
var jwt = require('jsonwebtoken')

var secret = require('../config/config.js');
var dbHelpers = require('../db/helpers.js');


var routeHelpers = {
  parseTokenError: function(err, token, callback) {
    // console.log('$$$$', jwtDecode(token));
    if (err.message === "jwt expired") {
      //refresh token or send to FE to refresh token
      callback({isValid: false});
    } else if (err.message === "invalid token") {
      callback({isValid: false});
    } else {
      callback(null, {isValid: true})
    }
  },

  verifyToken: function(token, callback) {
    jwt.verify(token, secret, (err, success) => {
      if (err) {
        console.log('routeHelpers -> verifyToken', err);
        // callback(err)
        this.parseTokenError(err, token, callback);
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