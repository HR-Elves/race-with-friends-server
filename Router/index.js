var fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.racewithfriends.tk/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/www.racewithfriends.tk/fullchain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxy();

const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

const request = require('request');

// Use the authentication middleware (comment out during integration steps)
// app.use(isAuthenticated)

const proxyTable = [
  { action: 'get', route: '/users/:userid/runs', target: 'http://runsservice:80' },
  { action: 'post', route: '/users/:userid/runs', target: 'http://runsservice:80' },  
  { action: 'get', route: '/runs/:runid', target: 'http://runsservice:80' },
  { action: 'delete', route: '/runs/:runid', target: 'http://runsservice:80' },
  { action: 'get', route: '/users/:userid/runs/:runid', target: 'http://runsservice:80' },
  { action: 'delete', route: '/users/:userid/runs/:runid', target: 'http://runsservice:80' },
  
  { action: 'get', route: '/challenges', target: 'http://challengesservice:80' },  
  { action: 'get', route: '/challenges/:challengeid', target: 'http://challengesservice:80' },
  { action: 'delete', route: '/challenges/:challengeid', target: 'http://challengesservice:80' },
  { action: 'get', route: '/challenges/:challengeid/opponents', target: 'http://challengesservice:80' },
  { action: 'post', route: '/challenges/:challengeid/opponents', target: 'http://challengesservice:80' },
  { action: 'delete', route: '/challenges/:challengeid/opponents', target: 'http://challengesservice:80' },
  { action: 'delete', route: '/challenges/:challengeid/opponents/:opponentid', target: 'http://challengesservice:80' },
  { action: 'get', route: '/users/:userid/challenges', target: 'http://challengesservice:80' },
  { action: 'post', route: '/users/:userid/challenges', target: 'http://challengesservice:80' },

  { action: 'get', route: '/liveraces', target: 'http://liveracesservice:5000' },
  { action: 'get', route: '/users/:userid/liveraces', target: 'http://liveracesservice:5000' },
  { action: 'post', route: '/users/:userid/liveraces', target: 'http://liveracesservice:5000' },
    
  { action: 'post', route: '/adduser', target: 'http://usersservice:5000' },
  { action: 'post', route: '/addfriend', target: 'http://usersservice:5000' },
  { action: 'get', route: '/search/name/:name', target: 'http://usersservice:5000' },
  { action: 'get', route: '/search/id/:id', target: 'http://usersservice:5000' },
  { action: 'get', route: '/users/all', target: 'http://usersservice:5000' },
  { action: 'get', route: '/friends/all/:userId', target: 'http://usersservice:5000' }
];

attachProxy(proxyTable);




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

// This function attached endpoints to the express server based on proxy table input
function attachProxy(proxyTable) {
  proxyTable.forEach(function(proxyEntry) {
    app[proxyEntry.action](proxyEntry.route, proxyTo(proxyEntry.target));
  });

  function proxyTo(target) {
    return function (req, res) {
      console.log('Request Path', req.url, ' --> Proxy to target: ', target);
      proxy.web(req, res, {
        target: target
      });
    };
  }
}

const httpsServer = https.createServer(credentials, app).listen(port, function() {
  console.log('Router HTTPS Server listening on port: ', port);
});

// Set up proxy for websocket connection forwarding to LiveracesService service
httpsServer.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head, {target: 'ws://liveracesservice:5000'});
});

