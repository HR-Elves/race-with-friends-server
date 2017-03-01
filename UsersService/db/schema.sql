DROP DATABASE IF EXISTS rwfusers;

CREATE DATABASE rwfusers;

-- USE rwfusers;

DROP TABLE IF EXISTS  users;

CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT,
  fb_id VARCHAR(255) NOT NULL,
  fullname MEDIUMTEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (fb_id),
  PRIMARY KEY (id)
);

-- ---
-- Table relationships
--
-- ---

DROP TABLE IF EXISTS relationships;

CREATE TABLE relationships (
  id INTEGER NOT NULL AUTO_INCREMENT,
  user_one_id VARCHAR(255) NOT NULL,
  user_two_id VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY `friends` (`user_one_id`, `user_two_id`)
);


-- insert into users (fb_id,fullname)values ('1','nick');
-- insert into users (fb_id,fullname)values ('2','james');
-- insert into users (fb_id,fullname)values ('3','stephen');
-- insert into users (fb_id,fullname)values ('4','derrick');
-- insert into users (fb_id,fullname)values ('5','jesus');








-- ---
-- Foreign Keys
-- ---

-- ALTER TABLE profile ADD FOREIGN KEY (userID) REFERENCES user (id);
-- ALTER TABLE rating ADD FOREIGN KEY (profileID) REFERENCES profile (id);
-- ALTER TABLE rating ADD FOREIGN KEY (filmID) REFERENCES film (id);
-- ALTER TABLE friends ADD FOREIGN KEY (primaryID) REFERENCES profile (id);
-- ALTER TABLE friends ADD FOREIGN KEY (friendID) REFERENCES profile (id);