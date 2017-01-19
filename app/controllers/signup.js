var mongoose = require('mongoose'),
  User = mongoose.model('User');
  var avatars = require('./avatars').all();

var moment = require('moment');
var jwt = require('jsonwebtoken');

var secret = process.env.JWT_SECRET;

exports.signup = function(req, res) {
	// check if reg has all the data
	if (req.body.name && req.body.password && req.body.email) {
		User.findOne({email:req.body.email}, function(err, exUser){
			if(err){
				throw err;
			}
			if(exUser){
				res.send({success: false, mess: 'Already a user'});
			}
			else{
				var user = new User(req.body);
				user.avatar = avatars[user.avatar];
	        	user.provider = 'local';
	        	user.save(function(err) {
			          if (err) {
			            return res.render('/#!/signup?error=unknown', {
			              errors: err.errors,
			              user: user
			            });
			          }
			         });
				var exp = moment().add(5, 'hours').valueOf();
				var token = jwt.sign({userId: user._id, exp:exp}, secret);
				res.json({success: true, mss: 'New user created', 
					token: token,
					exp: exp});
				console.log("HAAAAAA");
				//return res.redirect('/#!/');
			}
	    });
	  }
	  else{
	  	return res.redirect('/#!/signup?error=incomplete');
	  }
    
};