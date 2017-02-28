var fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.racewithfriends.tk/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/www.racewithfriends.tk/fullchain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const httpProxy = require('http-proxy');
// const HttpProxyRules = require('http-proxy-rules');

const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

const request = require('request');

const proxy = httpProxy.createProxy(); 

app.all('/users/:userid/runs', function (req, res) {
  proxy.web(req, res, {
    target: 'http://runsservice:80'
  });
});

app.get('/runs/:runid', function (req, res) {
  proxy.web(req, res, {
    target: 'http://runsservice:80'
  });
});

// Use the authentication middleware (comment out during integration steps)
// app.use(isAuthenticated)

// app.use('/user/:id', function (req, res, next) {
//   console.log('Request Type:', req.method);
//   next();
// }); 


app.get('/', isAuthenticated, function (req, res) {
  console.log('GET /');
  let statusCheckMessage = '';

  // checkRunsService(function(err, data) {
  //   if (err) {
  //     statusCheckMessage += 'RunsService Error: ' + err.message + '\n |';
  //   } else {
  //     statusCheckMessage += data + '\n |';
  //     checkUsersService(function(err, data) {
  //       if (err) {
  //         statusCheckMessage += 'UsersService Error: ' + err.message + '\n |';
  //       } else {
  //         statusCheckMessage += data + '\n |';
  //         res.status(200).send(statusCheckMessage);
  //         res.end();
  //       }
  //     });
  //   }
  // });

  res.status(200).send('OK!');
  res.end();
});

function isAuthenticated(req, res, next) {
  console.log('Authenticating...', req.query.token);
  request({url: 'http://usersservice:5000/auth/' + req.query.token, timeout: 1000}, function (error, response, body) {
    if (error) {
      console.log('isAuthenticated ->', error);
    } else if (response.statusCode === 200) {
      return next();
    } else if (response.statusCode === 401) {
      res.status(400).send(response);
      res.end();
    }
  });
}


function checkRunsService(callback) {
  console.log('Checking RunsService...');
  request({url: 'http://runsservice:80', timeout: 1000}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(null, 'RunsServiceReached - AutoDeploy Double Tested! Service Says: ' + body);
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


https.createServer(credentials, app).listen(port, function() {
  console.log('Example app listening on port: ', port);
});

// app.listen(port, function() {
//   console.log('Example app listening on port: ', port);
// });
