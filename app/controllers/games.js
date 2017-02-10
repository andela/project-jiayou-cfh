var mongoose = require('mongoose'),
  Games = mongoose.model('Game');

exports.startGame = function (req, res) {
  var gameId = 0;
  Games.find()
    .exec((err, games) => {
      if (err) {
        res.json({
          success: false,
          msg: 'An unexpected error occurred'
        });
      }
      if (!games) {
        gameId = 1;
      } else {
        gameId = Object.keys(games).length + 1;
      }
      var game = new Games({
        id: gameId,
        czar: req.body.email,
        winner: '',
        players: [req.body.email],
        numberOfRounds: 0,
        state: 'start',
      });
      game.save(function (err) {
        if (err) {
          res.json({
            success: false,
            msg: 'An unexpected error occurred'
          });
        } else {
          return res.json({
            success: true,
            gameId: game.id,
            czar: game.czar
          });
        }
        return res;
      });
    });
};

exports.updateGame = function (req, res) {
  Games.findOne({
      id: req.body.gameDbId
    })
    .exec((err, games) => {
      if (err) {
        res.json({
          success: false,
          msg: 'An unexpected error occurred'
        });
      }
      if (games) {
        gameId = Object.keys(games).length + 1;
      }
      var game = {
        id: req.body.gameId,
        czar: games.czar,
        winner: games.winner,
        players: games.player,
        numberOfRounds: games.numberOfRounds,
        state: games.start,
      };
      const query = {
        $and: [{
          game_id: game.id
        }, {
          czar: game.czar
        }]
      };
      Game.update(query, game, function (err, result) {
        if (err) {
          res.status(500).json({
            message: 'An error occured while updating this data',
            error: err
          });
        } else {
          res.status(200).json({
            message: 'Game updated sucessfully'
          });
        }
        return res;
      });
    });
};