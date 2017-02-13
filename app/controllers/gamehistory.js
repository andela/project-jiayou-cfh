const gameHistory = require('../models/gamehistory.js');

/*
 * Create New Game Record
 */
exports.createGame = (request, response) => {
    const game = new gameHistory();
    game.gameID = request.params.id;
    game.creator = request.body.creator;
    game.players = request.body.players;
    game.rounds = request.body.rounds;
    game.winner = request.body.winner;
    game.ended = request.body.ended;
    game.save((error, data) => {
        if (error) {
            response.status(400)
                .json(error);
        }
        response.status(201)
            .json(data);
    });
};


/*
 * Update Game Record
 */
exports.updateGame = (request, response) => {
    const gameCreator = request.body.creator;
    const gameId = request.params.id;
    const query = {
        $and: [
            { gameID: gameId }, { creator: gameCreator }
        ]
    }
    gameHistory.findOne(query, (error, history) => {
        if (error) {
            return response.status(500)
                .json({ message: 'An error occured while updating this data' });
        }
        if (!history) {
            return response.status(404)
                .json({ message: 'data not found' });
        }

        history.winner = request.body.winner;
        history.ended = request.body.ended;
        history.rounds = request.body.rounds;
        history.save((error, history) => {
            if (error) {
                return response.status(500)
                    .json({ message: 'An error occured while updating this data' });
            }
            return response.status(200)
                .json({ message: 'Game updated sucessfully', history });
        });
    });
};

/*
 * Find Game Records by id
 */
exports.getGame = (request, response) => {
    gameHistory.findOne({
        gameID: request.params.id
    }, (error, savedGame) => {
        if (error) {
            response.send(error);
        }
        if (!savedGame) {
            response.status(400)
                .json({
                    success: false,
                    message: 'Game Record Not Found!!'
                });
        } else {
            response.status(200)
                .json(savedGame);
        }
    });
};

/*
 * Find Game Records by id
 */
exports.getAllGames = (request, response) => {
    gameHistory.find({}, (error, savedGames) => {
        if (error) {
            response.status(404)
                .json(error);
        }
        if (!savedGames) {
            response.status(400)
                .json({
                    success: false,
                    message: 'No Game Record Available!!'
                });
        } else {
            response.status(200)
                .json(savedGames);
        }
    });
};

/*
 * Get Played Games for Logged-in Users
 */
exports.getUserGames = (request, response) => {
    gameHistory.find({ 'players.email': request.params.email }, (error, gameLogs) => {
        if (error) {
            response.status(404).json(error);
        } else {
            response.status(200).json(gameLogs);
        }
    });
};