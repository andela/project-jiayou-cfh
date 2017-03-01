/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
/**
 * Question Schema
 */
var NotificationsSchema = new Schema({
  status: String,
  message: String,
  user_Id: String,
  sender_Id: String,
  date: Date
});

mongoose.model('Notification', NotificationsSchema);
