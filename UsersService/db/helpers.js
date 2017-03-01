var connection = require('./db.js');
var Promise = require("bluebird");

// module.exports.dbHelpers = {};

var addUser = function(profile, callback) {
  console.log('profile in dbHelpers', profile.fb_id);
  var id = JSON.stringify(profile.fb_id);
  var name = JSON.stringify(profile.fullname);
  var pic = JSON.stringify(profile.pic);

  connection.query(`insert into users (fb_id,fullname,pic)values (`+ id +`,`+ name + `,` + pic + `);`, (err, success) => {
    if (err) {
      console.log('dbHelpers -> addUser', err);
      callback(err, null);
    } else {
      console.log('User successfully added to DB', success);
      callback(null, success);
    }
  })
}

var findUserById = function(fb_id, callback) {
  connection.query(`select * from users where fb_id=` + fb_id + `;`, (err, success) => {
    if (err) {
      console.log('findUserById error', err);
      callback(err, null);
    } else if (!err && success.length === 0) {
      callback('User not found in DB', null);
    } else {
      console.log('User found', success);
      callback(null, success[0]);
    }
  })
}

var findUserByIdAsync = Promise.promisify(findUserById);

var findUserByName = function(fullname, callback) {
  console.log('fullname', fullname)
  connection.query(`select * from users where fullname=` + "'" + fullname + "'" + `;`, (err, success) => {
    if (err) {
      console.log('dbHelpers -> findUserByName', err);
      callback(err, null);
    } else if (!err && success.length === 0) {
      callback('User not found in DB', null);
    } else {
      console.log('findUserByName DB query success: ', success);
      callback(null, success);
    }
  })
}

var verifyTwoUsersExist = function(user_one_id, user_two_id, callback) {
  findUserById(user_one_id, (err, user1) => {
    if (err) {
      console.log('verifyTwoUsersExist -> User1 not found', err);
      callback(err, null);
    } else {
      findUserById(user_two_id, (err, user2) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, user2);
        }
      })
    }
  })
}

var getAllUsers = function(callback) {
  connection.query(`select fb_id,fullname from users;`, (err, success) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, success);
    }
  })
}

var addFriend = function(user_one_id, user_two_id, callback) {
  var lowerId = user_one_id; //need to store lower of two users first to avoid duplicate entries
  var higherId = user_two_id;
  if (user_one_id > user_two_id) {
    lowerId = user_two_id;
    higherId = user_one_id;
  }
  verifyTwoUsersExist(user_one_id, user_two_id, (err, friend) => {
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

var getFriends = function(fb_id, callback) {
  fb_id = JSON.stringify(fb_id);
  connection.query(`select * from relationships WHERE (user_one_id = ` + fb_id + ` OR user_two_id = ` + fb_id + `);`, (err, success) => {
    if (err) {
      console.log('dbHelpers -> getFriends', err);
      callback(err, null);
    } else {
      fb_id = JSON.parse(fb_id);
      parseFriends(success, fb_id, callback);
    }
  })
}

var parseFriends = function(relationships, userId, next) {
  var friendsIds = relationships.map(rel => {
    if (rel.user_one_id === userId) {
      return rel.user_two_id;
    } else {
      return rel.user_one_id;
    }
  })
  //need to then find names of each friendId with another query
  var friends = friendsIds.map(id => {
    return findUserByIdAsync(id).then(user => user).catch(err => {
      next(err, null);
    })
  });

  Promise.all(friends).then(friend => {
    next(null, friend);
  })
}


module.exports.addUser = addUser;
module.exports.findUserById = findUserById;
module.exports.findUserByName = findUserByName;
module.exports.verifyTwoUsersExist = verifyTwoUsersExist;
module.exports.getAllUsers = getAllUsers;
module.exports.addFriend = addFriend;
module.exports.getFriends = getFriends;
module.exports.parseFriends = parseFriends;