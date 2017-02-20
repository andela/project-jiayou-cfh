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

exports.findAllRecord = function (req, res) {
  Games.find()
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
