const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

var counter = 0;

app.get('/', function (req, res) {
  res.send('UsersServicesOK! - Counter is: ' + counter);
  counter++;  
});

app.listen(port, function() {
  console.log('Users Management Service listening on port: ', port);
});
