angular.module('mean.system')
  .controller('DashboardController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'authService', '$http', '$window', 'gameModals', '$timeout', function($scope, Global, $location, socket, game, AvatarService, authService, $http, $window, gameModals, $timeout) {
    $scope.gameLog = () => {
      var userEmail = localStorage.getItem('Email');
      $http.get(`/api/games/history/${userEmail}`)
        .success((res) => {
          $scope.histories = res;
        })
        .error((err) => {
          console.log(err);
        });
    };

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
      var valuesWins = Object.values(tempWins);
      for (var j = 0; j < valuesWins.length; j += 1) {
        var max = valuesWins.reduce(function (valuePrior, valueNext) {
          return Math.max(valuePrior, valueNext);
        });
        if (max === j) {
          break;
        }
        for (var k = 0; k < valuesWins.length; k += 1) {
          if (valuesWins[k] === max) {
            valuesWins[k] = j+1;
          }
        }
      }
      for (var i = 0; i < valuesWins.length; i += 1) {
        var email = output["emails"][i];
        var tempView = [];
        tempView.push(valuesWins[i], output["avatars"][email], output["userNames"][email], email,
        output["numberOfWins"][email],output["points"][email]);
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
    $scope.gameLog();
  }]);
