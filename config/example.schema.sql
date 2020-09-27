CREATE DATABASE IF NOT EXISTS myDatabaseName;
GRANT ALL PRIVILEGES ON myDatabaseName.* TO 'myDbUser'@'localhost' IDENTIFIED BY 'super_secure_password';
CREATE TABLE IF NOT EXISTS pages (id INT AUTO_INCREMENT PRIMARY KEY, projectName VARCHAR(255) NOT NULL UNIQUE, projectSubtitle VARCHAR(255) NOT NULL, projectImage VARCHAR(255) NOT NULL, projectMediaLink VARCHAR(255) NOT NULL, projectLocation VARCHAR(255) NOT NULL UNIQUE, projectText TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, uname VARCHAR(255) UNIQUE NOT NULL, passwd VARCHAR(255) NOT NULL);
INSERT INTO pages (projectName, projectSubtitle, projectImage, projectMediaLink, projectLocation, projectText) VALUES ('Testproject', 'Test Project testing', '/img/test.jpg', 'https://youtube.com', 'test', 'this is a sample text');
INSERT INTO users (uname, passwd) VALUES ('admin', 'test');
SELECT * FROM pages WHERE 'projectName'='Testproject';