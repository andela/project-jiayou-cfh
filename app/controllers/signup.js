var mongoose = require('mongoose'),
  User = mongoose.model('User');
var avatars = require('./avatars').all();
var moment = require('moment');
var jwt = require('jsonwebtoken');
var secret = process.env.JWT_SECRET;

exports.signupAuth = function (req, res) {
 // check if req has all the data
  if (req.body.username && req.body.password && req.body.email) {
    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (err) {
        res.send({ success: false, mess: 'Unknown Error' });
        throw err;
      }
      if (existingUser) {
        res.send({ success: false, mess: 'Already a user' });
      } else {
        var user = new User(req.body);
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save(function (err) {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user
            });
          }
        });
        var exp = moment().add(5, 'hours').valueOf();
        var token = jwt.sign({ userId: user._id, exp }, secret);
        res.json({ success: true,
          mss: 'New user created',
          token,
          email: req.body.email,
          username: req.body.username,
          exp });
      }
    });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};
