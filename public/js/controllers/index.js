angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', 'authService', '$http', '$window', 'gameModals', function ($scope, Global, $location, socket, game, AvatarService, authService, $http, $window, gameModals) {
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

    $scope.showDialog = function () {
      $scope.title = 'Sign in was Successful!';
      $scope.message = 'Would you like to Start a new game?';
      $scope.templateUrl = 'views/start-game.html';
      gameModals.showDialog('IndexModalController', $scope);
    };

    var signInFailure = function (err) {
      $scope.userActive = false;
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
      authService.signUp($scope.credentials.email, $scope.credentials.password, $scope.credentials.username).then(signUpSuccess, signUpFailure);
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

    $scope.userLogin = function () {
      authService.signIn($scope.credentials.userEmail, $scope.credentials.userPassword).then(signInSuccess, signInFailure);
    };

    $scope.generateGameId = function (jwt) {
      $http.post('/api/games/0/start', {
        JWT: jwt,
        email: $scope.credentials.userEmail
      }).success(function (res) {
        const generatedGameId = res.gameId;
        $location.path('/app/').search({ gameDbId: generatedGameId, custom: 1 });
      }).error(function (err) {
        $scope.title = 'Game Creation Failed!';
        $scope.message = 'The game could not be created!';
        $scope.templateUrl = 'views/error_message.html';
        gameModals.showDialog('IndexModalController', $scope);
      });
    };
  }]);
angular.module('mean.system')
  .controller('IndexModalController', ['$scope', '$element', '$location', 'close', 'moment', function ($scope, $element, $location, close, moment) {
    $scope.dismissModal = function (result) {
      close(result, 200); // close, but give 200ms for bootstrap to animate
    };
    $scope.startGame = function () {
      if (moment().isBefore(localStorage.getItem('expDate'))) {
        $scope.generateGameId(localStorage.getItem('JWT'));
      } else {
        gameModals.showDialog('IndexModalController');
        $location.path('/charity');
      }
    };
    $scope.startDonation = function () {
      $location.path('/charity');
    };
  }]).directive('removeModal', ['$document', function ($document) {
    return {
      restrict: 'A',
      link: (scope, element) => {
        element.bind('click', () => {
          $document[0].body.classList.remove('modal-open');
          angular.element($document[0].getElementsByClassName('modal-backdrop')).remove();
          angular.element($document[0].getElementsByClassName('modal')).remove();
        });
      }
    };
  }]);
