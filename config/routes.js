var async = require('async');

module.exports = function(app, passport, auth) {
  // User Routes
  var users = require('../app/controllers/users');
  var signin = require('../app/controllers/signin');
  var signup = require('../app/controllers/signup');
  var answers = require('../app/controllers/answers');
  var questions = require('../app/controllers/questions');
  var avatars = require('../app/controllers/avatars');
  var index = require('../app/controllers/index');
  var games = require('../app/controllers/games');

  var signup = require('../app/controllers/signup');
  var invite = require('../app/controllers/invite');
  // Route for sign-in
  app.post('/api/auth/login', signin.userAuth);

  // Route for sign-up
  app.post('/api/auth/signup', signup.signupAuth);

  // game history
  app.post('/api/games/:id/start', users.authenticate, games.startGame);
  app.put('/api/games/:id/end', games.updateGame);
  app.post('/api/users/jwt/authenticated', users.isAuthenticated);
  app.get('/api/games/history/:email', games.getGame);

  app.post('/api/search/users', invite.invite);
  app.get('/api/userEmail', invite.getEmail);

  app.get('/signup', users.signup);
  app.get('/chooseavatars', users.checkAvatar);
  app.get('/signout', users.signout);

  // Setting up the users api
  app.post('/users', users.create);
  app.post('/users/avatars', users.avatars);

  // Donation Routes
  app.post('/donations', users.addDonation);

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);

  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/#!/app',
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  // This for new users redirects them to choose an avatar
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/#!/app',
    failureRedirect: '/signin'
  }), users.authCallback);

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/#!/app',
    failureRedirect: '/signin'
  }), users.authCallback);

  // Finish with setting up the userId param
  app.param('userId', users.user);

  // Answer Routes
  app.get('/answers', answers.all);
  app.get('/answers/:answerId', answers.show);
  // Finish with setting up the answerId param
  app.param('answerId', answers.answer);

  // Question Routes
  app.get('/questions', questions.all);
  app.get('/questions/:questionId', questions.show);
  // Finish with setting up the questionId param
  app.param('questionId', questions.question);

  // Avatar Routes
  app.get('/avatars', avatars.allJSON);

  // Home route
  app.get('/play', index.play);
  app.get('/', index.render);
  app.get('/gametour', index.gameTour);
};
