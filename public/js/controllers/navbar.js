angular.module('mean.system')
  .controller('NavbarController', ['$scope', '$location', '$http', 'authService', '$q',
    function ($scope, $location, $http, authService) {
      $scope.links = [
        { name: 'HOME', url: '#!/index', isActive: false },
        { name: 'CHARITY', url: '#!/charity', isActive: false },
        { name: 'ABOUT US', url: '#!/aboutus', isActive: false }
      ];

      var url = $location.url();

      var removeDashBoard = function () {
        if ($scope.links.length === 4) {
          $scope.links.pop();
        }
      };

      var addDashBoard = function () {
        if (url === "/game-log" || url === "/leader-board" || url === "/donation-log"  ) {
          $scope.links.push({ name: "DASHBOARD", url: "#!/game-log", isActive: true }); 
      }
        else {
          $scope.links.push({ name: "DASHBOARD", url: "#!/game-log", isActive: false });
        }
      };

      var showDashboard = function () {
        authService.isAuthenticated()
         .success(function (res) {
           if(res === true) {
             addDashBoard();
           }
           else {
             removeDashBoard();
           }
        });  
      };
      
      if ($scope.links.length !== 4) {
        showDashboard();
      }
      
      switch (url) {
        case '/':
          $scope.links[0].isActive = true;
          break;
        case '/charity':
          $scope.links[1].isActive = true;
          break;
        case '/aboutus':
          $scope.links[2].isActive = true;
          break;
      }
    }
  ]);