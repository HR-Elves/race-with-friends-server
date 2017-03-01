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

  getUserProfileById: function(profile, callback) {

    dbHelpers.findUserById(profile, (err, success) => {
      if (err) {
        console.log('routeHelpers -> addUser', err)
      } else {
        callback(null, success);
      }
    })
  },

  getUserProfileByName: function(fullname, callback) {
    dbHelpers.findUserByName(fullname, (err, success) => {
      if (err) {
        callback(err, null);
      } else {
        console.log('findUserByName success: ', success);
        callback(null, success);
      }
    })
  },



  addFriend: function(req, res) {
    dbHelpers.addFriend(req.params.userId, req.params.friendId, (err, success) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
        res.end();
      } else {
        console.log('success addFriend', success);
        res.status(200).send('You are now friends!');
        res.end();
      }
    })
  }


}

module.exports = routeHelpers;