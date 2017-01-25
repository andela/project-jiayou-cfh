angular.module('mean-system', ['ngMaterial'])
  .controller('AppCtrl', function ($scope, $mdDialog) {
    $scope.status = '  ';
    $scope.customFullscreen = false;
    $scope.showAlert = function (ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Error occured')
          .textContent('An unexpected error occured')
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
      );
    };
  });
