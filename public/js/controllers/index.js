angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'authService', '$window', '$timeout', function ($scope, Global, $location, socket, game, AvatarService, authService, $window, $timeout) {
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
    var signInSuccess = function (res) {
      if (res.success) {
        // Write token to local storage
        localStorage.setItem('JWT', res.token);
        localStorage.setItem('Email', res.userEmail);
        window.user = res.user;
        localStorage.setItem('expDate', res.expDate);
        $location.path('/app');
      } else if (res.message === 'Authentication failed wrong password') {
        $scope.message = 'Wrong password';
        $scope.errorMessage = true;
        // display error message for 4000ms
        $scope.timer(4000);
      } else if (res.message === 'An unexpected error occurred') {
        $scope.message = 'An unexpected error occured';
        $scope.errorMessage = true;
        // display error message for 4000ms
        $scope.timer(4000);
      } else if (res.message === 'Authentication failed user not found') {
        $scope.message = 'Email does not exist';
        $scope.errorMessage = true;
        // display error message for 4000ms
        $scope.timer(4000);
      } else {
        $location.path('/#!/signin');
      }
    };

    var signInFailure = function (err) {
      $scope.userActive = false;
    };

    $scope.userLogin = function () {
      authService.signIn($scope.credentials.userEmail, $scope.credentials.userPassword).then(signInSuccess, signInFailure);
    };

    var signUpSuccess = function (res) {
      if (res.success) {
        // Write token to local storage
        localStorage.setItem('jwtToken', res.token);
        window.user = res.user;
        $location.path('/gametour');
      } else if (res.message === 'Unknown Error') {
        $scope.message = 'An unexpected error occured';
        $scope.errorMessage = true;
        // display error message for 4000ms
        $scope.timer(4000);
      } else if (res.message === 'Already a user') {
        $scope.message = 'User already exists!';
        $scope.errorMessage = true;
        // display error message for 4000ms
        $scope.timer(4000);
      } else {
        $location.path('/#!/signup');
      }
    };

    var signUpFailure = function (err) {
      $scope.userActive = false;
    };

    $scope.userSignUp = function () {
      authService.signUp($scope.credentials.email, $scope.credentials.password,
      $scope.credentials.username).then(signUpSuccess, signUpFailure);
    };
    /**
     * Function to display a message for a time
     * @param{Integer} howLong - How long in milliseconds message should show
     * @returns{undefined}
     */
    $scope.timer = function (howLong) {
      $timeout(function () {
        $scope.errorMessage = false;
      }, howLong);
    };
  }]);
