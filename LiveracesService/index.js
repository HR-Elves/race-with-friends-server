const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const querystring = require('querystring');
const url = require('url');

const port = process.env.PORT || 5000;

var LiveRace = require('./src/LiveRace.js');

var counter = 0;

// Use body-parser middleware to parse JSON request data
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Liveraces Service OK! - Counter is: ' + counter);
  counter++;  
});

// Retrive all pending live races by a participant
app.get('/users/:userid/liveraces', function (req, res) {

});

// Create a new liverace
app.post('/users/:userid/liveraces', function (req, res) {

});

var httpServer = http.createServer(app).listen(port, function() {
  console.log('Liveraces Service listening on port: ', port);
});


const WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  server: httpServer,
  clientTracking: true
});

////////////////////////////////////////////////
// Handler for Message Passing via Websockets //
////////////////////////////////////////////////

// Object to store connected clients associated with a specific raceid
let ClientInRace = {};

wss.on('connection', function connection(ws) {
  console.log('websocket connection recieved');

  // Extract supplied query string values
  let parsedURL = url.parse(ws.upgradeReq.url);
  let queryStringValues = querystring.parse(parsedURL.query);

  // Parse URI path for the raceID
  // Expected URI is /liveraces/:raceID
  ws.raceID = parsePathForRaceID(parsedURL.pathname);

  // Save this client under a raceID
  if (ws.raceID !== undefined) {
    if (ClientInRace[ws.raceID] === undefined) {
      ClientInRace[ws.raceID] = [];
    }
    ClientInRace[ws.raceID].push(ws);
  }

  // Handle broadcasting of messages to all race participants
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    if (ws.raceID) {
      ClientInRace[ws.raceID].forEach(function(participantsWS) {
        // Only send to the other reace participants
        if (participantsWS !== ws) {
          participantsWS.send(message);
        }
      });
    }
  });

  // Remove user from race if connection is closed
  ws.on('close', function close() {
    console.log('connection closed, connection belongs to: raceID:', ws.raceID);
    listOfClientsInRace = ClientInRace[ws.raceID];

    if (listOfClientsInRace.indexOf(ws) !== -1) {
      listOfClientsInRace.splice(listOfClientsInRace.indexOf(ws), 1);
    }

    console.log('disconnected');
  });

  ws.send('something');
});

function parsePathForRaceID(inputPathName) {
  let splittedPath = inputPathName.split('/');
  if (splittedPath.length === 3) {
    let raceID = splittedPath[2];
    return raceID;
  } else {
    return undefined;
  }
}
