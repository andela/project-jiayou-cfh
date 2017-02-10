angular.module('mean.system')
  .factory('gameModals', ['$mdDialog', function ($mdDialog) {
    return {
      /* show Alert
      * 
      *@param {event} ev
      *@param {object} dialogDetails
      *@return {void}
      */
      showAlert: (ev, dialogDetails) => {
        // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
        $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title(dialogDetails.title)
        .textContent(dialogDetails.content)
        .ariaLabel(dialogDetails.label)
        .ok(dialogDetails.okTitle)
        .targetEvent(ev)
    );
      },
      /* show Confirm
      * 
      *@param {event} ev
      *@param {object} dialogDetails
      *@return {Event}
      *
      */
      showConfirm: (ev, dialogDetails) => {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title(dialogDetails.title)
          .textContent(dialogDetails.content)
          .ariaLabel(dialogDetails.label)
          .targetEvent(ev)
          .ok(dialogDetails.okTitle)
          .cancel(dialogDetails.cancelTitle);

        return $mdDialog.show(confirm);
      },
      
      /* show Prompt
      * 
      *@param {event} ev
      *@param {object} dialogDetails
      *@return {string} The input the user entered
      *
      */
      showPrompt: (ev, dialogDetails) => {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
      .title(dialogDetails.title)
      .textContent(dialogDetails.content)
      .placeholder(dialogDetails.placeholder)
      .ariaLabel(dialogDetails.label)
      .initialValue(dialogDetails.initialValue)
      .targetEvent(ev)
      .ok(dialogDetails.okTitle)
      .cancel(dialogDetails.cancelTitle);
        return $mdDialog.show(confirm).then(function (result) {
          return result;
        }, function () {
          return " ";
        });
      },

    };
  }]);
