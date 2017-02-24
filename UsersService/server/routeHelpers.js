var jwtDecode = require('jwt-decode');
var jwt = require('jsonwebtoken')

var secret = require('../config/config.js');
var dbHelpers = require('../db/helpers.js');


var routeHelpers = {
  decodeToken: function(token, callback) {
    // console.log('$$$$', jwtDecode(token));
    // callback(jwtDecode(token));
  },

  verifyToken: function(token, callback) {
    jwt.verify(token, secret, (err, success) => {
      if (err) {
        console.log('routeHelpers -> verifyToken', err)
        callback(err)
      } else {
        callback(null, success)
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