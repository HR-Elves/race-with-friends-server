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
        console.log('User successfully added to DB', success)
        callback(null, 'User successfully added to DB')
      }
    })
  },

  findUserById: function(profile, callback) {
    var id = JSON.stringify(profile.fb_id);
    connection.query(`select * from users where fb_id=` + id + `;`, (err, success) => {
      if (err) {
        console.log('dbHelpers -> findUser', err)
      } else {
        if (success.length === 0) {
          this.addUser(profile, callback);
        } else {
          console.log('User already exists in DB');
          callback(null, 'User already exists in DB');
        }
      }
    })
  },

  findUserByName: function(fullname, callback) {
    connection.query(`select * from users where fullname=` + "'" + fullname + "'" + `;`, (err, success) => {
      if (err) {
        console.log('dbHelpers -> findUserByName', err);
        callback(err, null);
      } else {
        console.log('findUserByName DB query success: ', success);
        callback(null, success);
      }
    })
  },

  addFriend: function(user_one_id, user_two_id, callback) {
    var lowerId = user_one_id;
    var higherId = user_two_id;
    if (user_one_id > user_two_id) {
      lowerId = user_two_id;
      higherId = user_one_id;
    }
    connection.query(`insert into relationships (user_one_id, user_two_id) values (`+ lowerId +`,`+ higherId +`);`, (err, success) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, success);
      }
    })
  }
}


module.exports = dbHelpers;