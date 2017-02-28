const express = require('express');
const app = express();
const routeHelpers = require('./server/routeHelpers.js');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

var counter = 0;

// app.use(bodyParser.json()); // for parsing application/json

app.get('/', function (req, res) {
  res.send('UsersServicesOK! - Counter is: ' + counter);
  counter++;
});

app.get('/auth/:token', function(req, res) {
  console.log('Users Service -> auth -> req.params.token', req.params.token)
  routeHelpers.verifyToken(req.params.token, (err, success) => {
    if (err) {
      console.log('Users Service -> response error', err);
      res.status(401).send(err);
      res.end();
    } else {
      console.log('Users Service -> response success', success);
      res.status(200).send(success);
      res.end();
    }
  })
});

app.post('/users', function(req, res) {
  console.log('request body: ', req.body)
  routeHelpers.getUserProfile(req.body, (err, success) => {
    if (err) {
      res.statusCode(401);
    } else {
      res.send(success);
    }
  })
});



//TODO:figure out which endpoint makes more sense. this performs same as above endpoint
app.post('/auth', function(req, res) {
  console.log(req.body.id_token)
  // res.send(req.body)
  routeHelpers.verifyToken(req.body.id_token, (err, success) => {
    if (err) {
      res.send(401);
    } else {
      res.send(success);
    }
  })
});

app.get('/friends/:id', function(req, res) {

});

app.post('/signup', function(req, res) {
  routeHelpers.addUser(req.body, (err, response) => {
    res.send(response);
  })
});

// app.post('/signin', function(req, res) {
//   routeHelpers.verifyToken(req.body, response => {
//     res.send(response)
//   })
// });

app.listen(port, function() {
  console.log('Users Management Service listening on port: ', port);
});