angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'authService', '$http', '$window', 'gameModals', '$timeout', function($scope, Global, $location, socket, game, AvatarService, authService, $http, $window, gameModals, $timeout) {
    $scope.global = Global;
    $scope.credentials = {};
    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function() {
      if ($location.search().error) {
        return $location.search().error;
      }
      return false;
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

    var signInSuccess = function(res) {
      if (res.success) {
        // Write token to local storage
        localStorage.setItem('JWT', res.token);
        localStorage.setItem('Email', res.userEmail);
        window.user = res.user;
        localStorage.setItem('expDate', res.expDate);
        $scope.showDialog();
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

    var startDonation = function() {
      $location.path('/charity');
    };
    var signout = function() {
      $http.get("/signout")
        .success(function(res) {
          $location.path('/signin');
        }).error(function(err) {
          var dialogDetails = {
            title: "Signout Failed",
            content: "Signout failed!",
            label: "Signout",
            okTitle: "Ok"
          };
          gameModals.showAlert($scope.event, dialogDetails);
        });
    };

    var startGame = function() {
      if (moment().isBefore(localStorage.getItem('expDate'))) {
        $scope.generateGameId(localStorage.getItem('JWT'));
      } else {
        var dialogDetails = {
          title: "Session Expired",
          content: "Please resign in, your session has expired!",
          label: "Session Expired",
          okTitle: "Ok"
        };
        gameModals.showAlert($scope.event, dialogDetails).then(function() {
          signout();
        });
      }
    };

    $scope.showDialog = function() {
      var dialogDetails = {
        title: "Sign in was Successful!",
        content: "Would you like to Start a new game?",
        label: "Start Game After Signin",
        okTitle: "Yes",
        cancelTitle: "No"
      };
      gameModals.showConfirm($scope.event, dialogDetails).then(function() {
        startGame();
        // $location.path('/app/').search({ custom: 1 });
      }, function() {
        startDonation();
      });
    };

    var signInFailure = function(err) {
      $scope.userActive = false;
    };

    var signUpSuccess = function(res) {
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

    var signUpFailure = function(err) {
      $scope.userActive = false;
    };

    $scope.userSignUp = function() {
      authService.signUp($scope.credentials.email, $scope.credentials.password, $scope.credentials.username).then(signUpSuccess, signUpFailure);
    };
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

    $scope.userLogin = function($event) {
      $scope.event = $event;
      authService.signIn($scope.credentials.userEmail, $scope.credentials.userPassword).then(signInSuccess, signInFailure);
    };

    $scope.generateGameId = function(jwt) {
      $http.post('/api/games/0/start', {
        JWT: jwt,
        email: $scope.credentials.userEmail
      }).success(function(res) {
        const generatedGameId = res.gameId;
        localStorage.setItem("gameDBId", generatedGameId);
        $location.path('/app/').search({ custom: 1 });
      }).error(function(err) {
        var dialogDetails = {
          title: "Game Creation Failed!",
          content: "The game could not be created!",
          label: "Game Creation Error",
          okTitle: "Ok"
        };
        gameModals.showAlert($scope.event, dialogDetails);
      });
    };
  }]);
