angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ngRoute', 'mean.system', 'mean.directives'])
 .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'views/index.html'
        }).
        when('/app', {
          templateUrl: '/views/app.html',
        }).
        when('/privacy', {
          templateUrl: '/views/privacy.html',
        }).
        when('/bottom', {
          templateUrl: '/views/bottom.html'
        }).
        when('/signin', {
          templateUrl: '/views/signin.html'
        }).
        when('/signup', {
          templateUrl: '/views/signup.html'
        }).
        when('/choose-avatar', {
          templateUrl: '/views/choose-avatar.html'
        }).
        when('/charity', {
          templateUrl: '/views/charity.html'
        }).
        when('/leader-board', {
          templateUrl: '/views/leader-board.html'
        }).
        when('/game-log', {
          templateUrl: '/views/game-log.html'
        }).
        when('/donation-log', {
          templateUrl: '/views/donation-log.html'
        }).
        when('/aboutus', {
          templateUrl: '/views/aboutus.html'
        }).
        when('/signin-up', {
          templateUrl: '/views/signin-up.html'
        }).
        when('/gametour', {
          templateUrl: '/views/tour.html'
        }).
         when('/history', {
          templateUrl: '/views/history.html'
        }).
        otherwise({
          redirectTo: '/'
        });
    }
  ]).config(['$locationProvider',
    function ($locationProvider) {
      $locationProvider.hashPrefix("!");
    }
  ]).config(['$locationProvider',
    function ($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ]).run(['$rootScope', function ($rootScope) {
    $rootScope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }]).run(['DonationService', function (DonationService) {
    window.userDonationCb = function (donationObject) {
      DonationService.userDonated(donationObject);
    };
  }]);

angular.module('mean.system', ['ngMaterial', 'ngMessages', 'ngSanitize', 'material.svgAssetsCache', 'angularMoment']);
<<<<<<< HEAD
angular.module('mean.directives', []);
=======
angular.module('mean.directives', []);
>>>>>>> 81b9eb61764ca4c244a5a24f3aa81cdae13cc899
