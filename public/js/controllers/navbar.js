angular.module('mean.system')
    .controller('NavbarController', ['$scope', '$location',
        function($scope, $location) {
            $scope.links = [
                { name: 'HOME', url:     '#!/index',   isActive: false },
                { name: 'CHARITY', url:  '#!/charity', isActive: false },
                { name: 'ABOUT US', url: '#!/aboutus', isActive: false }
            ];
            var url = $location.url();
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