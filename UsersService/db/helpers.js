var connection = require('./db.js');

dbHelpers = {
  addUser: function(profile) {
    console.log('profile in dbHelpers', JSON.stringify(profile.fb_id))
    var id = JSON.stringify(profile.fb_id)
    var name = JSON.stringify(profile.fullname)

    connection.query(`insert into users (fb_id,fullname)values (`+ id +`,`+ name +`);`, function(err, success) {
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