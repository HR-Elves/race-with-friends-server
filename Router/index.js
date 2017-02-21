const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

const request = require('request'); 


app.get('/', function (req, res) {
  console.log('GET /');
  let statusCheckMessage = '';

  checkRunsService(function(err, data) {
    if (err) {
      statusCheckMessage += 'RunsService Error: ' + err.message + '\n |';
    } else {
      statusCheckMessage += data + '\n |';
      checkUsersService(function(err, data) {
        if (err) {
          statusCheckMessage += 'UsersService Error: ' + err.message + '\n |';
        } else {
          statusCheckMessage += data + '\n |';
          res.status(200).send(statusCheckMessage);
          res.end();
        }
      });
    }
  });

  // res.send('CONTAINERIZED EXPERIMENT SUCCESSFUL')
});

function checkRunsService(callback) {
  console.log('Checking RunsService...');
  request({url: 'http://runsservice:5000', timeout: 1000}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(null, 'RunsServiceReached - AutoDeploy Tested! Service Says: ' + body);
    } else {
      callback(new Error(error), null);
    }
  });
}

function checkUsersService(callback) {
  console.log('Checking UsersService...');  
  request({url: 'http://usersservice:5000', timeout: 1000}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(null, 'UsersService! Service Says: ' + body);
    } else {
      callback(new Error(error), null);
    }
  });
}


app.listen(port, function() {
  console.log('Example app listening on port: ', port);
});
