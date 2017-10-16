(function ()
{
  'use strict';

  angular
    .module('app.pages.profile')
    .controller('NameDialogController', NameDialogController);

  /** @ngInject */
  function NameDialogController($mdDialog, User, profileService, msUtils, api)
  {
    var vm = this;
    // Data
    vm.title = 'Edit Profile';
    vm.user = User;

    // Methods
    vm.saveProfile = saveProfile;
    vm.closeDialog = closeDialog;
    vm.cancelDialog = cancelDialog;
    vm.toggleInArray = msUtils.toggleInArray;
    vm.exists = msUtils.exists;

    /**
     * Save profile
     */
    function saveProfile()
    {
      console.log("save profile");
      profileService.saveProfile(vm.user._id, vm.user).then(function(){
        closeDialog(vm.user);
      });
    }

    /**
     * Close dialog
     */
    function closeDialog(user)
    {
      $mdDialog.hide(user);
    }

    function cancelDialog(){
      $mdDialog.cancel();
    }

  }
})();
