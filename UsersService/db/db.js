var mysql = require('mysql');

var connectionParams = {
  host: "localhost",
  user: "root",
  password: "",
  database : "rwfusers"
}

var isProduction = process.env.productionMode;

if (isProduction) {
  connectionParams.host = "usersdb:3306";
  connectionParams.user = "root";
  connectionParams.password = "elves";
}

var connection = mysql.createConnection(connectionParams);

connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
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