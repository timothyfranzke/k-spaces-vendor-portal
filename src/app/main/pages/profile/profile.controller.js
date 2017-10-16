(function ()
{
    'use strict';

    angular
        .module('app.pages.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController(About, config, $mdDialog, $document, profileService, avatarGeneratorService)
    {
        var vm = this;

        // Data
        //vm.posts = Timeline.posts;
        //vm.activities = Timeline.activities;
        vm.about = About.data;
        console.log(vm.about);
        //vm.photosVideos = PhotosVideos.data;

      vm.openNameDialog = openNameDialog;
      vm.openContactInfoDialog = openContactInfoDialog;
      vm.createAvatar = createAvatar;

        // Methods
      /**
       * Open new contact dialog
       *
       * @param ev
       */
      function openNameDialog(ev)
      {
        $mdDialog.show({
          controller         : 'NameDialogController',
          controllerAs       : 'vm',
          templateUrl        : 'app/main/pages/profile/dialogs/name/name-dialog.html',
          parent             : angular.element($document.find('#profile')),
          targetEvent        : ev,
          clickOutsideToClose: true,
          locals             : {
            User    : vm.about
          }
        })
          .then(function(user){
            vm.about = user;
          },
          function(err){
            console.log(err);
          });
      }

      function openContactInfoDialog(ev){
        $mdDialog.show({
          controller         : 'ProfileDialogController',
          controllerAs       : 'vm',
          templateUrl        : 'app/main/pages/profile/dialogs/profile/contact-dialog.html',
          parent             : angular.element($document.find('#profile')),
          targetEvent        : ev,
          clickOutsideToClose: true,
          locals             : {
            User    : vm.about
          }
        })
        .then(function(user){
            vm.about = user;
          },
          function(err){
            console.log(err);
          });
      }

      function createAvatar(){
        avatarGeneratorService.avatarGenerator(function(image){
          vm.about.hasImage = true;
          avatarGeneratorService.resizeImage(image)
            .then(function(res){
              console.log("calling save image");
              vm.image = res;
              profileService.saveUserImage(vm.image, vm.about).then(function(user){
                vm.about = user;
              })
            })
        })
      }


        //////////
    }

})();
