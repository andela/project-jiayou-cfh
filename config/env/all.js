var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    db: process.env.C4H_DB_HOST    
}
