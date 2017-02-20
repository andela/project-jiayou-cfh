angular.module('mean.system')
  .controller('DashboardController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'authService', '$http', '$window', 'gameModals', '$timeout', function ($scope, Global, $location, socket, game, AvatarService, authService, $http, $window, gameModals, $timeout) {
    $scope.views = [];

    var getObjectSize = function (object) {
      return Object.keys(object).length;
    };

    var setAvatar = function (index, newAvatar, output) {
      var email = output["emails"][index];
      output["avatars"][email] = newAvatar;
    };

    var setEmail = function (newEmail, output) {
      var emailsArray = output["emails"];
      if (!emailsArray.includes(newEmail)) {
        emailsArray.push(newEmail);
      }
      output["emails"] = emailsArray;
    };

    var setPoint = function (index, newPoint, output) {
      var email = output["emails"][index];
      output["points"][email] = newPoint;
    };

    var setRanks = function (output) {
      var tempWins = output["numberOfWins"];
      var tempPoints = output["points"];
      var valuesWins = Object.values(tempWins);
      var valuesPoints = Object.values(tempPoints);
      var prevMaxWins = 0;
      var prevMaxPoints = 0;
      for (var j = 0; j < valuesWins.length; j += 1) {
        var maxWins = valuesWins.reduce(function (valuePrior, valueNext) {
          return Math.max(valuePrior, valueNext);
        });
        var maxPoints = valuesPoints.reduce(function (valuePrior, valueNext) {
          return Math.max(valuePrior, valueNext);
        });
        if (maxWins === j && maxPoints === j) {
          break;
        }
        for (var k = 0; k < valuesWins.length; k += 1) {
          if (valuesWins[k] === maxWins && prevMaxWins !== maxWins) {
            valuesWins[k] = j+1;
          }
          if (valuesPoints[k] === maxPoints && prevMaxPoints !== maxPoints) {
            valuesPoints[k] = j+1;
          }
        }
        prevMaxPoints = maxPoints;
        prevMaxWins = maxWins;
      }
      var ranks = [];
      for (var m = 0; m < valuesPoints.length; m += 1) {
        valuesWins[m] = (valuesWins[m] + valuesPoints[m]) / 2;
        ranks[m] = valuesWins[m];
      }
      
      for (var n = 0; n < ranks.length; n += 1) {
        var maxWinsFinal = valuesWins.reduce(function (valuePrior, valueNext) {
          return Math.max(valuePrior, valueNext);
        });
        for (var l = 0; l < ranks.length; l += 1) {
          if (ranks[l] === maxWinsFinal) {
            var pos = ranks.length - n;
            if (pos === 1) {
              ranks[l] = pos+"st";
            } else if (pos === 2) {
              ranks[l] = pos+"nd";
            } else if (pos === 3) {
              ranks[l] = pos+"rd";
            } else {
              ranks[l] = pos+"th";
            }
          }
        }
        valuesWins[valuesWins.indexOf(maxWinsFinal)] = 0;
      }
      for (var i = 0; i < valuesWins.length; i += 1) {
        var email = output["emails"][i];
        var tempView = [];
        tempView.push(ranks[i], output["avatars"][email], output["userNames"][email], email,
        output["numberOfWins"][email], output["points"][email]);
        $scope.views[i] = tempView;
      }
    };

    var setNumberOfWins = function (newEmail, output) {
      var numberOfWins = output["numberOfWins"];
      if (numberOfWins[newEmail] !== undefined) {
        numberOfWins[newEmail] += 1;
      } else {
        numberOfWins[newEmail] = 1;
      }
      output["numberOfWins"] = numberOfWins;
    };

    var setPointsAvatar = function (output, players) {
      _.map(players, function (player) {
        _.map(player, function (playerInner) {
          var outputUserNames = Object.values(output["userNames"]);
          if (outputUserNames.includes(playerInner['username'])){
            var index = outputUserNames.indexOf(playerInner['username']);
            setAvatar(index, playerInner["avatar"], output);
            setPoint(index, playerInner["points"], output);
          }
        });
      });
      setRanks(output);
    };

    var getUserDetails = function (callbackFunc) {
      var jwt = localStorage.getItem("JWT");
      var userDetails;
      $http.post("/api/users/getAllUserDetails", {
        JWT: jwt
      })
        .success(function (res) {
          callbackFunc(res.users);
        })
        .error(function (err) {
          console.log(err);
        });
    };

    var populateLeaderBoardContents = function (games, output) {
      var gamesSize = getObjectSize(games);
      var winnerObj = {};
      var players = [];
      getUserDetails(function (userDetails) {
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

    var getAllGames = function (output) {
      var jwt = localStorage.getItem("JWT");
      var games;
      $http.post("/api/games", {
        JWT: jwt
      })
        .success(function (res) {
          games = res.gameCollection;
          populateLeaderBoardContents(games, output);
        })
        .error(function (err) {
          console.log(err);
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
    getAllGames(output);
  }]);
