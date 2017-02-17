/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  _ = require('underscore');

/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 */
exports.play = function (req, res) {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};


/**
 * Redirect users to the tour of the app
 */
exports.gameTour = function(req, res) {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/gametour?custom');
  } else {
    res.redirect('/#!/gametour');
  }
};

exports.render = function(req, res) {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
};
