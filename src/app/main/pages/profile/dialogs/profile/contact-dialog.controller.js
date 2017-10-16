(function ()
{
    'use strict';

    angular
        .module('app.pages.profile')
        .controller('ProfileDialogController', ProfileDialogController);

    /** @ngInject */
    function ProfileDialogController($mdDialog, User, profileService, msUtils, api)
    {
        var vm = this;
        // Data
        vm.title = 'Edit Profile';
        vm.user = User;

        // Methods
        vm.saveProfile = saveProfile;
        vm.closeDialog = closeDialog;
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
         * Delete Contact Confirm Dialog
         */
        function deleteContactConfirm(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the contact?')
                .htmlContent('<b>' + vm.user.name + ' ' + vm.user.lastName + '</b>' + ' will be deleted.')
                .ariaLabel('delete contact')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

            });
        }

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

    }
})();
