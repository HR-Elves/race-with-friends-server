var jwtDecode = require('jwt-decode');
var jwt = require('jsonwebtoken')

var secret = require('../config/config.js');
var dbHelpers = require('../db/helpers.js');


var parseTokenError = function(err, token, callback) {
  if (err.message === "jwt expired" || err.message === "invalid token") {
    callback({isValid: false});
  } else {
    callback(null, {isValid: true});
  }
}

verifyToken = function(token, callback) {
  jwt.verify(token, secret, (err, success) => {
    if (err) {
      console.log('routeHelpers -> verifyToken', err);
      // parseTokenError(err, token, callback);
      callback(err);
    } else {
      callback(null, success);
    }
  });
}

var getUserProfileById = function(req, res) {
  dbHelpers.findUserById(req.params.id, (err, success) => {
    if (err) {
      console.log('routeHelpers -> addUser', err)
      res.status(400).send(err);
      res.end();
    } else {
      res.status(200).send(success);
      res.end();
    }
  })
}

var getUserProfileByName = function(req, res) {
  console.log('Searching for user', req.params.name);
  dbHelpers.findUserByName(req.params.name, (err, success) => {
    if (err) {
      res.status(400).send(err);
      res.end();
    } else {
      res.status(200).send(success);
      res.end();
    }
  })
}

var getAllUsers = function(req, res) {
  dbHelpers.getAllUsers((err, success) => {
    if (err) {
      res.status(500).send(err);
      res.end();
    } else {
      res.status(200).send(success);
      res.end();
    }
  })
}

var addUser = function(req, res) {
  dbHelpers.addUser(req.body, (err, success) => {
    if (err) {
      res.status(400).send(err);
      res.end();
    } else {
      res.status(200).send(success);
      res.end();
    }
  })
}

var addFriend = function(req, res) {
  dbHelpers.addFriend(req.params.userId, req.params.friendId, (err, success) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
      res.end();
    } else {
      res.status(200).send(success);
      res.end();
    }
  })
}

var getFriends = function(req, res) {
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


module.exports.parseTokenError = parseTokenError;
module.exports.verifyToken = verifyToken;
module.exports.getUserProfileById = getUserProfileById;
module.exports.getUserProfileByName = getUserProfileByName;
module.exports.getUserProfileByName = getUserProfileByName;
module.exports.addUser = addUser;
module.exports.getAllUsers = getAllUsers;
module.exports.addFriend = addFriend;
module.exports.getFriends = getFriends;