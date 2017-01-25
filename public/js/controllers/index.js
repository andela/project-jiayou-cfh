angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$http', '$window', function ($scope, Global, $location, socket, game, AvatarService, $http, $window) {
    $scope.global = Global;
    $scope.credentials = {};
    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function () {
      if ($location.search().error) {
        return $location.search().error;
      }
      return false;
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });
    $scope.userLogin = function () {
      $http.post('/api/auth/login', { email: $scope.credentials.userEmail, password: $scope.credentials.userPassword }).success(function (res) {
        if (res.success) {
          // Write token to local storage
          localStorage.setItem('JWT', res.token);
          localStorage.setItem('Email', res.userEmail);
          $location.path('/app');
        } else if (res.message === 'An unexpected error occurred') {
          // Display a modal if an error occured
        } else {
          $location.path('/#!/signin');
        }
      }).error(function (err) {
        $scope.userActive = false;
      });
    };
  }]);

