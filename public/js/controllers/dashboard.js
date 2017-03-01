angular.module('mean.system')
  .controller('DashboardController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'authService', '$http', '$window', 'gameModals', '$timeout', function($scope, Global, $location, socket, game, AvatarService, authService, $http, $window, gameModals, $timeout) {

    /**
     * Function to display a message for a time
     * @param{Integer} howLong - How long in milliseconds message should show
     * @returns{undefined}
     */
    $scope.timer = function(howLong) {
      $timeout(function() {
        $scope.errorMessage = false;
      }, howLong);
    };

    $scope.views = [];

    /**
     * Function to get the size of an object
     * @param{object} object - The object to get its size
     * @returns{Integer}
     */
    var getObjectSize = function(object) {
      return Object.keys(object).length;
    };

    /**
     * Function to set winner avatar
     * @param{Integer} index - The Index of the user, avatar is to be set for
     * @param{String} newAvatar - The path info for the avatar
     * @param{object} output - The object bearing data for all fields we need to display
     * @returns{void}
     */
    var setAvatar = function(index, newAvatar, output) {
      var email = output["emails"][index];
      output["avatars"][email] = newAvatar;
    };

    /**
     * Function to set winner email
     * @param{String} newEmail - The email discovered for a winner
     * @param{object} output - The object bearing data for all fields we need to display
     * @returns{void}
     */
    var setEmail = function(newEmail, output) {
      var emailsArray = output["emails"];
      if (!emailsArray.includes(newEmail)) {
        emailsArray.push(newEmail);
      }
      output["emails"] = emailsArray;
    };

    /**
     * Function to set winner points
     * @param{Integer} index - The index of the user new point is to be set for
     * @param{Integer} newPoint - The point discovered for a winner
     * @param{object} output - The object bearing data for all fields we need to display
     * @returns{void}
     */
    var setPoint = function(index, newPoint, output) {
      var email = output["emails"][index];
      output["points"][email] = newPoint;
    };

    /**
     * Function to set all winners rank
     * @param{object} output - The object bearing data for all fields we need to display
     * @returns{void}
     */
    var setRanks = function(output) {
      var tempWins = output["numberOfWins"];
      var tempPoints = output["points"];
      var valuesWins = Object.values(tempWins);
      var valuesPoints = Object.values(tempPoints);
      var valuesPointsSetStat = [];
      var valuesWinsSetStat = [];
      var prevMaxWins = 0;
      var prevMaxPoints = 0;
      for (var j = 0; j < valuesWins.length; j += 1) {
        var maxWins = valuesWins.reduce(function(valuePrior, valueNext) {
          return Math.max(valuePrior, valueNext);
        });
        var maxPoints = valuesPoints.reduce(function(valuePrior, valueNext) {
          return Math.max(valuePrior, valueNext);
        });
        for (var k = 0; k < valuesWins.length; k += 1) {
          if (valuesWins[k] === maxWins && valuesWinsSetStat !== 1) {
            valuesWins[k] = j + 1;
            valuesWinsSetStat[k] = 1;
          }
          if (valuesPoints[k] === maxPoints && valuesPointsSetStat[k] !== 1) {
            valuesPoints[k] = j + 1;
            valuesPointsSetStat[k] = 1;
          }
        }
        prevMaxPoints = maxPoints;
        prevMaxWins = maxWins;
      }
      var ranks = [];
      var ranksMain = [];
      for (var m = 0; m < valuesPoints.length; m += 1) {
        valuesWins[m] = (valuesWins[m] + valuesPoints[m]) / 2;
        ranks[m] = valuesWins[m];
      }
      for (var n = 0; n < ranks.length; n += 1) {
        var maxWinsFinal = valuesWins.reduce(function(valuePrior, valueNext) {
          return Math.max(valuePrior, valueNext);
        });
        for (var l = 0; l < ranks.length; l += 1) {
          if (ranks[l] === maxWinsFinal) {
            var pos = ranks.length - n;
            if (pos === 1) {
              ranks[l] = pos + "st";
              ranksMain[l] = pos;
            } else if (pos === 2) {
              ranks[l] = pos + "nd";
              ranksMain[l] = pos;
            } else if (pos === 3) {
              ranks[l] = pos + "rd";
              ranksMain[l] = pos;
            } else {
              ranks[l] = pos + "th";
              ranksMain[l] = pos;
            }
          }
        }
        valuesWins[valuesWins.indexOf(maxWinsFinal)] = 0;
      }

      var maxRank = ranksMain.reduce(function(valuePrior, valueNext) {
        return Math.max(valuePrior, valueNext);
      });
      var temprank = {};
      for (var i = 0; i < valuesWins.length; i += 1) {
        var email = output["emails"][i];

        var lowestRank = ranksMain.reduce(function(valuePrior, valueNext) {
          return Math.min(valuePrior, valueNext);
        });

        var indexOfLowest = ranksMain.indexOf(lowestRank);
        if (ranksMain[indexOfLowest] !== (maxRank + 1)) {
          temprank[output["emails"][indexOfLowest]] = lowestRank;
          ranksMain[indexOfLowest] = maxRank + 1;
        }
      }
      for (var rank in temprank) {
        var email = rank;
        $scope.views.push([temprank[rank], output["avatars"][email], output["userNames"][email], email,
          output["numberOfWins"][email], output["points"][email]
        ]);
      }
    };

    /**
     * Function to set winner's number of wins
     * @param{String} newEmail - The email of the user the number
     * of wins is to be incremented for
     * @param{object} output - The object bearing data for all fields we need to display
     * @returns{void}
     */
    var setNumberOfWins = function(newEmail, output) {
      var numberOfWins = output["numberOfWins"];
      if (numberOfWins[newEmail] !== undefined) {
        numberOfWins[newEmail] += 1;
      } else {
        numberOfWins[newEmail] = 1;
      }
      output["numberOfWins"] = numberOfWins;
    };

    /**
     * Function to extract winner points and avatar
     * @param{object} output - The object bearing data for all fields we need to display
     * @param{array} players - The array of players from
     * which the avatar and point will be extracted from
     * @returns{void}
     */
    var setPointsAvatar = function(output, players) {
      _.map(players, function(player) {
        _.map(player, function(playerInner) {
          var outputUserNames = Object.values(output["userNames"]);
          if (outputUserNames.includes(playerInner['username'])) {
            var index = outputUserNames.indexOf(playerInner['username']);
            setAvatar(index, playerInner["avatar"], output);
            setPoint(index, playerInner["points"], output);
          }
        });
      });
      setRanks(output);
    };

    /**
     * Function to get all registered user details from database
     * @param{function} callbackFunc - Function to continue processing
     * when the asynchronous call returns
     * @returns{void}
     */
    var getUserDetails = function(callbackFunc) {
      var jwt = localStorage.getItem("JWT");
      var userDetails;
      $http.post("/api/users/getAllUserDetails", {
          JWT: jwt
        })
        .success(function(res) {
          callbackFunc(res.users);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    /**
     * Function to populate output object
     * with data needed to leader board
     * @param{object} games - The object bearing all games played
     * @param{object} output - The object that should
     * contain all leaderboard data
     * @returns{void}
     */
    var populateLeaderBoardContents = function(games, output) {
      var gamesSize = getObjectSize(games);
      var winnerObj = {};
      var players = [];
      getUserDetails(function(userDetails) {
        for (var i = 0; i < gamesSize; i += 1) {
          var winner = games[i]["winner"];
          var record = _.findWhere(userDetails, {
            username: winner
          });
          if (record !== undefined) {
            var email = record["email"];
            if (winnerObj[email] === undefined) {
              winnerObj[email] = winner;
              setNumberOfWins(email, output);
              setEmail(email, output);
              players.push(games[i]["players"]);
            }
          }
        }
        output["userNames"] = winnerObj;
        setPointsAvatar(output, players);
      });
    };

    /**
     * Function to get all games in the database
     * @param{object} output - The object that should
     * contain all leaderboard data
     * @returns{void}
     */
    var getAllGames = function(output) {
      var jwt = localStorage.getItem("JWT");
      var games;
      $http.post("/api/games", {
          JWT: jwt
        })
        .success(function(res) {
          games = res.gameCollection;
          if (getObjectSize(games) > 0) {
            populateLeaderBoardContents(games, output);
          } else {
            var location = $location.path();
            if (location === '/leader-board') {
              $scope.message = 'No games played have winners yet!';
              $scope.errorMessage = true;
              $scope.timer(4000);
            }
          }
        })
        .error(function(err) {
          var location = $location.path();
          if (location === '/leader-board') {
            $scope.message = 'An unexpected error occurred!';
            $scope.errorMessage = true;
            $scope.timer(4000);
          }
        });
    };
    var output = {
      emails: [],
      numberOfWins: {},
      avatars: {},
      userNames: {},
      points: {},
      ranks: {}
    };

    /**
     * Function to get all games played
     * by logged in user in the database
     * @param{void}
     * @returns{void}
     */
    $scope.gameLog = () => {
      var userEmail = localStorage.getItem('Email');
      $http.get(`/api/games/history/${userEmail}`)
        .success((res) => {
          if (res.length > 0) {
            $scope.histories = res;
          } else {
            var location = $location.path();
            if (location === '/game-log') {
              $scope.message = 'No games played yet';
              $scope.errorMessage = true;
              $scope.timer(4000);
            }
          }
        })
        .error((err) => {
          var location = $location.path();
          if (location === '/game-log') {
            $scope.message = 'An unexpected error occurred!';
            $scope.errorMessage = true;
            $scope.timer(4000);
          }
        });
    };
    getAllGames(output);
    $scope.gameLog();
  }]);
