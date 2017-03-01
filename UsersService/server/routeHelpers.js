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

  addUser: function(req, res) {
    dbHelpers.addUser(req.body, (err, success) => {
      if (err) {
        res.status(400).send(err);
        res.end();
      } else {
        res.status(200).send(success);
        res.end();
      }
    })
  },

  getAllUsers: function(req, res) {
    dbHelpers.getAllUsers((err, success) => {
      if (err) {
        res.status(500).send(err);
        res.end();
      } else {
        res.status(200).send(success);
        res.end();
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
        res.status(200).send(success);
        res.end();
      }
    })
  },

  getFriends: function(req, res) {
    dbHelpers.getFriends(req.params.userId, (err, success) => {
      if (err) {
        res.status(400).send(err);
        res.end();
      } else {
        res.status(200).send(success);
        res.end();
      }
    })
  }


}

module.exports = routeHelpers;