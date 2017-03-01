var jwtDecode = require('jwt-decode');
var jwt = require('jsonwebtoken')

var secret = require('../config/config.js');
var dbHelpers = require('../db/helpers.js');


exports.parseTokenError = function(err, token, callback) {
  if (err.message === "jwt expired" || err.message === "invalid token") {
    callback({isValid: false});
  } else {
    callback(null, {isValid: true});
  }
}

exports.verifyToken = function(token, callback) {
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

exports.getUserProfileById = function(req, res) {
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

exports.getUserProfileByName = function(req, res) {
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

exports.getAllUsers = function(req, res) {
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

exports.addUser = function(req, res) {
  dbHelpers.addUser(req.body, (err, success) => {
    if (err) {
      res.status(400).send(err);
      res.end();
    } else {
      res.status(200).send();
      res.end();
    }
  })
}

exports.addFriend = function(req, res) {
  dbHelpers.addFriend(req.body.userId, req.body.friendId, (err, success) => {
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

exports.getFriends = function(req, res) {
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