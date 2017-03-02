var mysql = require('mysql');

var developmentParams = {
  host: "localhost",
  user: "root",
  password: "",
  database : "rwfusers"
}

var productionParams = {
  host: "usersdb",
  user: "root",
  password: "elves",
  database: "rwfusers"
}

var isDevMode = process.env.devMode;
var connectionParams;

isDevMode ? connectionParams = developmentParams : connectionParams =  productionParams;

var connection = mysql.createConnection(connectionParams);

connection.connect(err => {
  if(err){
    console.log('Error connecting to DB', err);
    return;
  }
  console.log('Connection established');
});

connection.on('error', function(err) {
  if (err.fatal) {
    setTimeout(() => {
      connection.connect();
    }, 1000)
  }
});

module.exports = connection;