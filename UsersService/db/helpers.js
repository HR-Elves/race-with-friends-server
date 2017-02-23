var connection = require('./db.js');

dbHelpers = {
  addUser: function(profile) {
    // console.log(connection)
    connection.query(`insert into users (fb_id,fullname)values ('10104841851597483','Nick Cobbett');`, function(err, success) {
      if (err) {
        console.log('error adding user to db', err)
      } else {
        console.log('success', success)
        connection.end();
      }
    })
  }
}


module.exports = dbHelpers;