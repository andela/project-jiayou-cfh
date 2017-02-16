angular.module('mean.system')
  .controller('DashboardController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'authService', '$http', '$window', 'gameModals', '$timeout', function($scope, Global, $location, socket, game, AvatarService, authService, $http, $window, gameModals, $timeout) {
    $scope.gameLog = () => {
      var userEmail = localStorage.getItem('Email');
      $http.get(`/api/games/history/${userEmail}`)
        .success((res) => {
          console.log(res);
          $scope.histories = res;
        })
        .error((err) => {
          console.log(err);
        });
    };

    $scope.gameLog();
  }]);
