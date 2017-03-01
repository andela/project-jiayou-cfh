var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  GitHubStrategy = require('passport-github').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  User = mongoose.model('User'),
  config = require('./config');


module.exports = function (passport) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, function (err, user) {
      user.email = null;
      user.facebook = null;
      user.hashed_password = null;
      done(err, user);
    });
  });

  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function (email, password, done) {
      User.findOne({
        email: email
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
        user.email = null;
        user.hashed_password = null;
        return done(null, user);
      });
    }
  ));

  // Use twitter strategy
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  },
    function (token, tokenSecret, profile, done) {
      User.findOne({
        'twitter.id_str': profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            username: profile.username,
            provider: 'twitter',
            twitter: profile._json
          });
          user.save(function (err) {
            if (err) {
              // Work on this...
              console.log(err);
            }
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));

  // Use facebook strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
    enableProof: true
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log(profile);
          user = new User({
            name: profile.displayName,
            email: (profile.emails && profile.emails[0].value) || '',
            username: profile.username,
            provider: 'facebook',
            facebook: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            user.facebook = null;
            console.log(user);
            return done(err, user);
          });
        } else {
          user.facebook = null;
          return done(err, user);
        }
      });
    }
  ));

  // Use github strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || config.github.clientID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET || config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'github.id': profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'github',
            github: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));

  // Use google strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        'google.id': profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'google',
            google: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));
};
