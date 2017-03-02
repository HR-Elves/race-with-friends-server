var connection = require('./db.js');

var usersTable = 'CREATE TABLE users (' +
    'fb_id VARCHAR(255) NOT NULL,' +
    'fullname MEDIUMTEXT NOT NULL,' +
    'pic VARCHAR(255) NOT NULL,' +
    'createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
    'UNIQUE (fb_id)' +
  ');';
var relationshipsTable = 'CREATE TABLE relationships (' +
  'user_one_id VARCHAR(255) NOT NULL,' +
  'user_two_id VARCHAR(255) NOT NULL,' +
  'createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
  'UNIQUE KEY `friends` (`user_one_id`, `user_two_id`)' +
');';


exports.dropTables = function(req, res) => {
  connection.query('DROP TABLE users;', (err, success) => {
    if (!err) {
      connection.query('DROP TABLE relationships;', (err, success) => {
        if (!err) {
          res.status(200).send('Tables dropped successfully');
          res.end();
        }
      })
    }
  })
}

exports.createTables = function(req, res) {
  connection.query(usersTable, (err, success) => {
    if (err) {
      res.status(400).send(err);
      res.end();
    } else (!err) {
      connection.query(relationshipsTable, (err, success) => {
        if (err) {
          res.status(400).send(err);
          res.end();
        } else {
          res.status(200).send('Tables created!');
          res.end();
        }
      })
    }
  })
}