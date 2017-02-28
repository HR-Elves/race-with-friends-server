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

connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db', err);
    return;
  }
  console.log('Connection established');
});

// db.end(function(err) {
//   // The connection is terminated gracefully
//   // Ensures all previously enqueued queries are still
//   // before sending a COM_QUIT packet to the MySQL server.
// });

module.exports = connection;