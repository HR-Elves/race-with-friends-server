const express = require('express');
const app = express();
const routeHelpers = require('./server/routeHelpers.js');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dbconfig = require('./db/dbconfig.js');

const port = process.env.PORT || 5000;

var counter = 0;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/', function (req, res) {
  res.send('UsersServicesOK! - Counter is: ' + counter);
  counter++;
});


app.get('/auth/:token', routeHelpers.verifyToken);

app.post('/adduser', routeHelpers.addUser);
app.post('/addfriend', routeHelpers.addFriend);

app.get('/search/name/:name', routeHelpers.getUserProfileByName);
app.get('/search/id/:id', routeHelpers.getUserProfileById);
app.get('/users/all', routeHelpers.getAllUsers);
app.get('/friends/all/:userId', routeHelpers.getFriends);

//dev endpoint for dropping and adding tables
app.delete('/droptables', dbconfig.dropTables);
app.post('/createtables', dbconfig.createTables);



app.listen(port, function() {
  console.log('Users Management Service listening on port: ', port);
});


// app.get('/auth/:token', function(req, res) {
//   console.log('Users Service -> auth -> req.params.token', req.params.token);
//   routeHelpers.verifyToken(req.params.token, (err, success) => {
//     if (err) {
//       console.log('Users Service -> response error', err);
//       res.status(401).send(err);
//       res.end();
//     } else {
//       console.log('Users Service -> response success', success);
//       res.status(200).send(success);
//       res.end();
//     }
//   })
// });