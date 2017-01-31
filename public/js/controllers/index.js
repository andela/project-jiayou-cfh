//var moment = require('moment');
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

    $scope.userSignUp = function () {
      $http.post('/api/auth/signup', {
        email: $scope.credentials.email,
        password: $scope.credentials.password,
        username: $scope.credentials.username
      }).success(function (res) {
        if (res.success) {
          $window.localStorage.setItem('jwtToken', res.token);
          $location.path('/app');
        } else {
          $location.path('/#!/signup');
        }
      }).error(function (err) {
        $scope.userActive = false;
      });
    };
  }]);

angular.module('mean.system')
  .controller('SigninController', ['$scope', 'Global', '$location', 'socket', 'game', '$http', '$window', 'ModalService', function ($scope, Global, $location, socket, game, $http, $window, ModalService) {

    $scope.userLogin = function () {
      $http.post('/api/auth/login', {
        email: $scope.credentials.userEmail,
        password: $scope.credentials.userPassword
      }).success(function (res) {
        if (res.success) {
          // Write token to local storage
          localStorage.setItem('JWT', res.token);
          localStorage.setItem('Email', res.userEmail);
          localStorage.setItem('expDate', res.expDate);
          $location.path('/app');
          $scope.signinSuccess = true;
          $scope.showDialog(res);
        } else if (res.message === 'An unexpected error occurred') {
          // Display a modal if an error occured
          $scope.signinSuccess = false;
          $scope.showDialog(res);
          console.log('An unexpected error occurred');
        } else {
          $location.path('/#!/signin');
          //console.log('An unexpected error occurred');
        }
      }).error(function (err) {
        $scope.userActive = false;
      });
    };

    $scope.showDialog = function (res) {
      if ($scope.signinSuccess) {
        $scope.message = 'Would you like to Start a new game?';
        $scope.title = 'Sign in was Successful!';
        $scope.templateUrl = '../../views/start-game.html';
      } else if ($scope.jwtExpired) {
        $scope.message = 'Your sign in session has expired, please re-login!';
        $scope.title = 'Session Token Expired!';
        $scope.templateUrl = '../../views/error_message.html';
      } else {
        $scope.message = 'An unexpected Error occurred, please sign in again!';
        $scope.title = 'Sign in Failed!';
        $scope.templateUrl = '../../views/start-game.html';
      }
      ModalService.showModal({
        templateUrl: $scope.templateUrl,
        controller: 'ModalController',
        scope: $scope
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $location.path('/donation');
        });
      });
    };
  }]);

// meanSystem.controller('ModalController', ['$scope', '$element', 'close', function ($scope, $element, close) {
//     $scope.dismissModal = function (result) {
//       close(result, 200); // close, but give 200ms for bootstrap to animate
//     };
//     $scope.startGame = function () {
//       if (localStorage.getItem('expDate').isAfter(moment())) {
//         $location.path('/app');
//       } else {
//         $scope.jwtExpired = true;
//         $scope.showModal();
//       }
//     };
//     $scope.startDonation = function () {
//       $location.path('/donations');
//     };
//   }]).directive('removeModal', ['$document', function ($document) {
//     return {
//       restrict: 'A',
//       link: function (scope, element) {
//         element.bind('click', function () {
//           $document[0].body.classList.remove('modal-open');
//           angular.element($document[0].getElementsByClassName('modal-backdrop')).remove();
//           angular.element($document[0].getElementsByClassName('modal')).remove();
//         });
//       }
//     };
//   }]);