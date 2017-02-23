const express = require('express');
const app = express();
const routeHelpers = require('./server/routeHelpers.js');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;

var counter = 0;

app.get('/', function (req, res) {
  res.send('UsersServicesOK! - Counter is: ' + counter);
  counter++;
});

app.get('/sessions/:token', function(req, res) {
  routeHelpers.verifyToken(req.params.token, response => {
    res.send(response);
  })
})

app.get('/friends/:id', function(req, res) {

})

app.listen(port, function() {
  console.log('Users Management Service listening on port: ', port);
});


// var token = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25pY2tjb2JiZXR0LmF1dGgwLmNvbS8iLCJzdWIiOiJmYWNlYm9va3wxMDEwNDg0MTg1MTU5NzQ4MyIsImF1ZCI6Ilh4eUo4WUsycXlzRVVTWGJyckJTUVBPT0poYUwzN29NIiwiZXhwIjoxNDg3ODQyNjEwLCJpYXQiOjE0ODc4MDY2MTB9.NoFYt4cSi0dTORKZYYfoohAj-pZWC0U3fSIca5Dpwwk