var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Friend = mongoose.model('Friend'),
  Notification = mongoose.model('Notification');
var MongoClient = require('mongodb').MongoClient;
var sendMail = require('sendgrid').mail;
var dburl = process.env.DB_URL;
var transporter, message;
var sender = require('sendgrid').mail;
exports.invite = function (req, res) {
  fromEmail = 'fisayomi.ojuri@andela.com';
  subject = 'Invite to join Cards for Humanity game';
  content =
  `<html>\
  <body>\
    <label>Hello, <\label><br>\
    <p> I would like to invite you to join cards for humanity game. </p>\
    <p>Kindly click this  <a href ='${req.body.link}'/> link </a> to join</p>\
    <br><p>Regards,<p>jiayou team.</p></p>\
  </body>\
  </html>`;
  mailer = {
    personalizations: [{
      to: req.body.emailArray,
      subject: `${subject}`
    }],
    content: [{
      type: 'text/html',
      value: `${content}`
    }],
    from: { email: fromEmail }
  };
  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mailer
  });

  sg.API(request, function (error, response) {
    res.send(response);
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};

exports.getEmail = function (req, res) {
  var arr = [];
  User.find(function (err, users) {
    users.forEach((value, index) => {
      // console.log(value.email);
      arr.push(value.email);
    });
    res.send(arr);
  });
};

exports.addFriend = function (req, res) {
  var newFriend = new Friend();
  Friend.findOne({ friend_email: req.body.email, user_id: req.body.user_id }, function (err, friends) {
    if (friends) {
      res.send({ success: false, message: 'Already a friend' });
    } else {
      User.findOne({ email: req.body.email }, function (err, friend) {
        newFriend.friend_id = friend._id;
        newFriend.friend_email = req.body.email;
        newFriend.user_id = req.body.user_id;
        newFriend.save(function (err) {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user
            });
          }
        });
      });
      res.json({ succ: 'Successful', email: req.body.email });
    }
  });
};

exports.getFriendsEmail = function (req, res) {
  var arr = [];
  Friend.find({ user_id: req.query.user_id }, function (err, friend) {
    friend.forEach((value) => {
      arr.push(value.friend_email);
    });
    res.send(arr);
  });
};

exports.getAFriend = function (req, res) {
  var id = '';
  Friend.find({ friend_email: req.query.friend_email }, function (err, friend) {
    friend.forEach((value) => {
      id = value.friend_id;
    });
    res.send(id);
  });
};

exports.getNotifications = function (req, res) {
  var notify = {};
  Notification.find({}, function (err, notification) {
    notification.forEach((value) => {
      notify.message = value.message;
      notify.date = value.date;
      notify.user_Id = value.user_Id;
      notify.sender_Id = value.sender_Id;
    });
    res.send(notify);
  });
};

exports.getUserName = function (req, res) {
  var userName = '';
  User.find({ email: req.query.email }, function(err, user) {
    user.forEach((userDetails) => {
      userName = userDetails.username;
    });
    res.send(userName);
  });
};

