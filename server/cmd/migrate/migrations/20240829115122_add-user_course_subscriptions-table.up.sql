CREATE TABLE IF NOT EXISTS user_course_subscriptions (
  `userID` INT UNSIGNED NOT NULL,
  `courseID` INT UNSIGNED NOT NULL,
  `notificationToken` VARCHAR(255) NOT NULL,

  PRIMARY KEY (userID, courseID),
  FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (courseID) REFERENCES courses(id) ON DELETE CASCADE
);