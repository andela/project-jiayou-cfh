/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
/**
 * Question Schema
 */
var FriendsSchema = new Schema({
  user_id: String,
  friend_email: String,
  friend_id: String
});

mongoose.model('Friend', FriendsSchema);
