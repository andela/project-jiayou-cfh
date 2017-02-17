/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcryptjs'),
  _ = require('underscore'),
  authTypes = ['github', 'twitter', 'facebook', 'google'];


/**
 * Games Schema
 */
var GameSchema = new Schema({
  id: {
    type: Number
  },
  creator: {
    type: String
  },
  winner: {
    type: String,
    default: ''
  },
  players: {
    type: Array,
    default: [],
  },
  numberOfRounds: {
    type: Number,
    default: 1
  },
  state: {
    type: String,
    default: 'start'
  },
  date_created: {
    type: Date,
    default: Date.now
  },

});

/**
 * Pre-save hook
 */
GameSchema.pre('save', function (next) {
  return next();
});

mongoose.model('Game', GameSchema);

