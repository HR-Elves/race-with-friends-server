const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

const request = require('request'); 


app.get('/', function (req, res) {
  request('http://runservice:5000', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send('RouterService Reached! Runs Services Says: ' +  body); // Show the HTML for the Google homepage.
    } else {
      res.statusCode = 200;
      res.send(error);
    }
  })

  // res.send('CONTAINERIZED EXPERIMENT SUCCESSFUL')
});

app.listen(port, function() {
  console.log('Example app listening on port: ', port);
});
