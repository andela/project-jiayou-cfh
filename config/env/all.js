var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');
var keys = rootPath + '/keys.txt';

module.exports = {
	root: rootPath,
	port: process.env.PORT,
<<<<<<< HEAD
    db: process.env.DB_URL,
	port: process.env.PORT
=======
  db: process.env.DB_URL 
>>>>>>> c8f3b6561eb76f9080c8104f6bc1d85fa94d8f18
};
