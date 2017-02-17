var mongoose = require('mongoose'),
  Game = mongoose.model('Game');

exports.startGame = function (req, res) {
  var gameId = 0;
  Game.find()
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
      var game = new Game({
        id: gameId,
        creator: req.body.email,
        winner: '',
        players: [],
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
  Game.findOne({
    id: req.params.id
  }).exec((err, games) => {
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
      winner: req.body.winner.username,
      players: req.body.players,
      numberOfRounds: req.body.numberOfRounds,
      state: req.body.state
    };
    const query = {
      $and: [{
        id: game.id
      }, {
        creator: game.creator
      }]
    };
    Game.update({ id: req.params.id }, game, function (err, result) {
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

exports.getGame = function (req, res) {
  Game.find({ creator: req.params.email }, function (err, result) {
    if (err) {
      res.status(500).json({
        message: 'An error occured while updating this data',
        error: err
      });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.findAllRecord = function (req, res) {
  Game.find()
    .exec((err, games) => {
      if (err) {
        return res.json({
          success: false,
          msg: 'An unexpected error occurred'
        });
      } else {
        res.send({ gameCollection: games });
      }
    });
};
