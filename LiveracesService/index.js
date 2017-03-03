const http = require('http');
const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

var counter = 0;

app.get('/', function (req, res) {
  res.send('Liveraces Service OK! - Counter is: ' + counter);
  counter++;  
});

var httpServer = http.createServer(app).listen(port, function() {
  console.log('Liveraces Service listening on port: ', port);
});


const WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  server: httpServer
});

wss.on('connection', function connection(ws) {
  console.log('websocket connection recieved');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
