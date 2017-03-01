var connection = require('./db.js');

dbHelpers = {
  addUser: function(profile, callback) {
    console.log('profile in dbHelpers', profile.fb_id);
    var id = JSON.stringify(profile.fb_id);
    var name = JSON.stringify(profile.fullname);

    connection.query(`insert into users (fb_id,fullname)values (`+ id +`,`+ name +`);`, (err, success) => {
      if (err) {
        console.log('dbHelpers -> addUser', err);
        callback(err, null);
      } else {
        console.log('User successfully added to DB', success);
        callback(null, success);
      }
    })
  },

  findUserById: function(fb_id, callback) {
    // var id = JSON.stringify(profile.fb_id);
    connection.query(`select * from users where fb_id=` + fb_id + `;`, (err, success) => {
      if (err) {
        console.log('findUserById error', err);
        callback(err, null);
      } else if (!err && success.length === 0) {
        callback('User not found in DB', null);
      } else {
        console.log('User found', success);
        callback(null, success);
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

  verifyTwoUsersExist: function(user_one_id, user_two_id, callback) {
    this.findUserById(user_one_id, (err, user1) => {
      if (err) {
        console.log('verifyTwoUsersExist -> User1 not found', err);
        callback(err, null);
      } else {
        this.findUserById(user_two_id, (err, user2) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, user2);
          }
        })
      }
    })
  },

  getAllUsers: function(callback) {
    connection.query(`select fb_id,fullname from users;`, (err, success) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, success);
      }
    })
  },

  addFriend: function(user_one_id, user_two_id, callback) {
    var lowerId = user_one_id; //need to store lower of two users first to avoid duplicate entries
    var higherId = user_two_id;
    if (user_one_id > user_two_id) {
      lowerId = user_two_id;
      higherId = user_one_id;
    }
    this.verifyTwoUsersExist(user_one_id, user_two_id, (err, friend) => {
      if (err) {
        callback(err);
      } else {
        connection.query(`insert into relationships (user_one_id, user_two_id) values (`+ lowerId +`,`+ higherId +`);`, (err, success) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, friend);
          }
        })
      }
    })
  }


}


module.exports = dbHelpers;