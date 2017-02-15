angular.module('mean.system')
  .controller('DashboardController', ['$scope', 'game', '$timeout', '$location', 'MakeAWishFactsService', '$dialog', '$http', 'gameModals', function ($scope, game, $timeout, $location, MakeAWishFactsService, $dialog, $http, gameModals) {

    $scope.players = [];

    $scope.getAllGames = function (callback) {
      var jwt = localStorage.getItem("JWT");
      var games;
      $http.post("/api/games", {
        JWT: jwt
      })
        .success(function (res) {
          games = res.gameCollection;
          callback(games);
        })
        .error(function (err) {
          console.log(err);
        });
    };

    var getObjectSize = function (object) {
      return Object.keys().length;
    };

    $scope.isEmail = function (email) {
      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(email);
    };

    $scope.getAllGames(function (games) {
      console.log(games);
      for (var i = 0; i < getObjectSize($scope.games); i += 1) {
        if (games[players] !== []) {
          $scope.players.push(games[players]);
        }
      }
    });
    
  }]);
