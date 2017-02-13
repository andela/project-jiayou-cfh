var mongoose = require('mongoose'),
    Games = mongoose.model('Game');

exports.startGame = function(req, res) {
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
            //const game = new Games();
            // games.id = gameId;
            // games.creator = req.body.creator;
            // games.winner = req.body.winner;
            // games.players = req.body.players;
            // games.numberOfRounds = request.body.rounds;
            // games.state = 'start';
            var game = new Games({
                id: gameId,
                creator: req.body.email,
                winner: '',
                players: [],
                numberOfRounds: 0,
                state: 'start',
            });
            game.save(function(err) {
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

exports.updateGame = function(req, res) {
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

            // games.winner = req.body.winner;
            // games.numberOfRounds = req.body.rounds;
            // games.state = req.body.state;
            var game = {
                // id: req.body.gameId,
                // creat: req.body.czar,
                winner: '',
                players: req.body.players,
                numberOfRounds: 0,
                state: 'end'
            };
            const query = {
                $and: [{
                    game_id: game.id
                }, {
                    creator: game.creator
                }]
            };
            Game.update(query, game, function(err, result) {
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