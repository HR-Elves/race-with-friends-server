var jwtDecode = require('jwt-decode');
var jwt = require('jsonwebtoken')

var secret = require('./config/config.js');

var routeHelpers = {
  decodeToken: function(token, callback) {
    // console.log('$$$$', jwtDecode(token));
    // callback(jwtDecode(token));
  },

  verifyToken: function(token, callback) {
    jwt.verify(token, secret, (err, success) => {
      if (err) {
        console.log('err', err)
      } else {
        callback(success)
        console.log('success verifyToken', success)
      }
    });
  }

}

module.exports = routeHelpers;