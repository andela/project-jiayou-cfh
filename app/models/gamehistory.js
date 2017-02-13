/**
 * Module dependencies.
 */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;
/**
 * Answer Schema
 */
const GameHistorySchema = new Schema({
    gameID: { type: String, required: true },
    started: { type: Date, default: Date.now },
    ended: { type: Boolean, default: false },
    rounds: { type: Number, default: 0 },
    creator: { type: String, required: true },
    winner: { type: String, default: '' },
    players: { type: Array, default: [] },
});

// export model
module.exports = mongoose.model('GameHistory', GameHistorySchema);