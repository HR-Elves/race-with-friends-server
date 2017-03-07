const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const querystring = require('querystring');
const url = require('url');

const port = process.env.PORT || 5000;

let LiveRace = require('./src/LiveRace.js');
let LiveRaces = {};
let LiveRacesCount = 0;

var counter = 0;

// Use body-parser middleware to parse JSON request data
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Liveraces Service OK! - Counter is: ' + counter);
  counter++;  
});

// Retrieve all liveraces where the user is a participant
// Supplied by a query parameter ?userid=<someUserID>
app.get('/liveraces', function (request, response) {

  let currentUserID = request.query.participantID;
  if (currentUserID) {
    let participatedRaceIDs = [];

    for (raceID in LiveRaces) {
      let currentRace = LiveRaces[raceID];
      if (currentRace.participantsIDs.includes(currentUserID)) {
        participatedRaceIDs.push(currentRace.id);
      }
    }
    response.json(participatedRaceIDs);

  } else {
    response.statusCode = 400;
    response.statusMessage = 'Error: QueryString parameter "participantID" required';
    response.send();
    response.end();
  }
});

// Retrive all live races organised by a user
app.get('/users/:userid/liveraces', function (request, response) {
  resultRaceIDs = [];

  for (raceID in LiveRaces) {
    currentLiveRace = LiveRaces[raceID];
    if (currentLiveRace.organiserID === request.params.userid) {
      resultRaceIDs.push(currentLiveRace.id);
    }
  }

  response.json(resultRaceIDs);

});

// Create a new liverace
app.post('/users/:userid/liveraces', function (request, response) {
  console.log('POST to /users/:userid/liveraces invoked');
  let raceOpponentIDs = request.body.opponentIDs;
  let raceName = request.body.name;
  let raceDescription = request.body.description;
  let raceLength = request.body.length;

  // Detect invalid inputs
  if (raceOpponentIDs === undefined || Array.isArray(raceOpponentIDs) === false) {
    response.statusCode = 400;
    response.send();
    response.end();
    console.log('invalid input for POST');
    return;
  }

  let newLiveRaceID = LiveRacesCount;
  let newLiveRace = new LiveRace(newLiveRaceID, raceName, raceDescription, raceLength, request.params.userid, raceOpponentIDs);
  LiveRaces[newLiveRaceID] = newLiveRace;
  console.log('New Live Race:', JSON.stringify(LiveRaces[newLiveRaceID]));

  LiveRacesCount = LiveRacesCount + 1;

  // console.log(JSON.stringify(newLiveRace));
  console.log('LiveraceLobby Created:', {id: newLiveRace.id});
  response.json({id: newLiveRace.id});

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
wss.on('connection', function connection(ws) {
  console.log('Websocket onConnect');

  // Extract supplied query string values
  let parsedURL = url.parse(ws.upgradeReq.url);
  let queryStringValues = querystring.parse(parsedURL.query);
  ws.userID = queryStringValues.userid;

  // Parse URI path for the raceID
  // Expected URI is /liveraces/:raceID
  ws.raceID = parsePathForRaceID(parsedURL.pathname);

  console.log('userID: ', ws.userID);
  console.log('raceID: ', ws.raceID);

  // Add participant to Race
  if (LiveRaces[ws.raceID]) {
    LiveRaces[ws.raceID].addParticipantToLobby(ws.userID, ws);
    console.log('OK: RaceID found, adding participant');
  } else {
    console.log('ERROR: No race with Supplied RaceID exists');
    ws.send('Error: No Race with Supplied RaceID exists');
    ws.close();
  }

  // Handle Incoming Messages
  ws.on('message', function incoming(messagetext) {
    console.log('Message Recieved, Message Text: ', messagetext);
    let message = undefined;
    try {
      message = JSON.parse(messagetext);
      if (message.length === 0) {
        console.log('Parsed Message Length is Zero, No Action');
        return;
      }
    } catch (e) {
      console.log('indexjs: Error on JSON.parse(): ', e);
      return;
    }
    console.log('Parsed Message: ', message);
    switch (message[0]) {
    case 'ready':
      LiveRaces[ws.raceID].setParticipantIsReady(ws.userID);
      break;
    case 'not-ready':
      LiveRaces[ws.raceID].unsetParticipantIsReady(ws.userID);    
      break;
    case 'position-update':
      LiveRaces[ws.raceID].broadcastPosition(ws.userID, message[1]);
      break;
    // Default will be to broadcast all messages
    default:
      LiveRaces[ws.raceID].broadcast(message);
    }

    return;
  });

  // Remove user from race if connection is closed
  ws.on('close', function close() {
    console.log('Websocket onClose called: WS connection with raceID:', ws.raceID);

    if (ws.raceID !== undefined && LiveRaces[ws.raceID] !== undefined) {
      LiveRaces[ws.raceID].removeParticipantFromLobby(ws.userID);
    } else {
      console.log('No Race Corresponding to RaceID found');
    }

    console.log('disconnected');
  });
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
