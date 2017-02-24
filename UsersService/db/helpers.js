var connection = require('./db.js');

dbHelpers = {
  addUser: function(profile, callback) {
    console.log('profile in dbHelpers', JSON.stringify(profile.fb_id))
    var id = JSON.stringify(profile.fb_id)
    var name = JSON.stringify(profile.fullname)

    connection.query(`insert into users (fb_id,fullname)values (`+ id +`,`+ name +`);`, (err, success) => {
      if (err) {
        console.log('dbHelpers -> addUser', err)
      } else {
        callback(null, 'User successfully added to DB')
      }
    })
  },

  findUser: function(profile, callback) {
    console.log('profile in dbHelpers', JSON.stringify(profile))
    var id = JSON.stringify(profile.fb_id)
    connection.query(`select * from users where fb_id=` + id + `;`, (err, success) => {
      if (err) {
        console.log('dbHelpers -> findUser', err)
      } else {
        console.log('User already exists in DB', success)
        if (success.length === 0) {
          this.addUser(profile, callback);
        } else {
          callback(null, 'User already exists in DB');
        }
      }
    })
  }
}


module.exports = dbHelpers;