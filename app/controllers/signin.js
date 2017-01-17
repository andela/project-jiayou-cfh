var mongoose = require('mongoose'),
    User = mongoose.model('User');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var secret = process.env.SECRET;
var dotEnv = require('dotenv');
dotEnv.config();

exports.userAuth = function(req, res){
	User.findOne({
		email: req.body.email
	}, function(err, user){
		if(err) throw err;

		if(!user){
			res.send({success: false, msg: "Authentication failed user not found"});
		} else {
			if(user.authenticate(req.body.password)){
				var token = jwt.sign(user, secret);
				//use moment to state that the token will last for 5 hours
				res.json({success: true, token: 'JWT ' + token, expDate: moment().add(5, 'h')});
			} else {
				res.send({success: false, message: 'Authentication failed wrong password'});
			}
		}

	});
};