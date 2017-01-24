angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$http', '$window', function ($scope, Global, $location, socket, game, AvatarService,  $http, $window){
    $scope.global = Global;
    $scope.credentials = {};
    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function() {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

    $scope.userLogin = function(){
      $http.post('/api/auth/login', {email: $scope.credentials.userEmail, password: $scope.credentials.userPassword}).success(function(res){
        if(res.success){
          $window.sessionStorage.setItem('JWT', res.token);
          $location.path('/app');
        } else {
          $location.path('/#!/signin');
        }
      }).error(function(err){
        $scope.userActive = false;
        console.log('err:', err);
      });
    };

}]);