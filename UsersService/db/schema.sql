DROP DATABASE IF EXISTS rwfusers;

CREATE DATABASE rwfusers;

-- USE rwfusers;

-- USE heroku_a82769b4f508eba;

DROP TABLE IF EXISTS  users;

CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT,
  fb_id VARCHAR(255) NOT NULL,
  fullname MEDIUMTEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ---
-- Table relationships
--
-- ---

DROP TABLE IF EXISTS relationships;

CREATE TABLE relationships (
  id INTEGER NOT NULL AUTO_INCREMENT,
  user_one_id INTEGER NOT NULL,
  user_two_id INTEGER NOT NULL,
  status INTEGER NOT NULL,
  action_user_id INTEGER NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (user_one_id,user_two_id)
);








-- ---
-- Foreign Keys
-- ---

-- ALTER TABLE profile ADD FOREIGN KEY (userID) REFERENCES user (id);
-- ALTER TABLE rating ADD FOREIGN KEY (profileID) REFERENCES profile (id);
-- ALTER TABLE rating ADD FOREIGN KEY (filmID) REFERENCES film (id);
-- ALTER TABLE friends ADD FOREIGN KEY (primaryID) REFERENCES profile (id);
-- ALTER TABLE friends ADD FOREIGN KEY (friendID) REFERENCES profile (id);