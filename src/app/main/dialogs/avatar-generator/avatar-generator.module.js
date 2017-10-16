(function ()
{
  'use strict';

  angular
    .module('app.avatar-generator',
      [
        // 3rd Party Dependencies
        'ngImgCrop'
      ]
    )
    .controller('AvatarGeneratorController', AvatarGeneratorController)
    .factory('avatarGeneratorService', avatarGeneratorService);


  /** @ngInject */
  function avatarGeneratorService($q, $mdToast, $mdDialog, msApi, api, CommonService, config, $state) {
    var defer = $q.defer();
    var service = {
      createAvatar: createAvatar,
      avatarGenerator: avatarGenerator,
      resizeImage : resizeImage
    };

    return service;

    function createAvatar(image) {
      // This is a dummy function for a demo.
      // In real world, you would do an API
      // call to add new product to your
      // database.

      api.images.save(image, function () {

        locations.unshift(location);

        CommonService.setToast('Location Created', config.toast_types.info);
        $state.go('app.manage.locations');
      }, function (err) {
        CommonService.setToast(err, config.toast_types.error);
        $state.go('app.manage.locations');
      });


    }

    function avatarGenerator(processImage) {
      $mdDialog.show({
        controller: 'AvatarGeneratorController',
        templateUrl: 'app/main/dialogs/avatar-generator/avatar-generator.html',
        clickOutsideToClose: true,
        fullscreen: false
      }).then(processImage);
    }

    function resizeImage(image64) {
      var i = new Image();
      i.onerror = function (err, m) {
        console.log(m)
      };

      i.onload = function () {
        var image = {};
        var canvas = document.createElement("canvas");
        //context.clearRect(0, 0, canvas.width, canvas.height);
        var thumbCanvas = document.createElement("canvas");
        //context.clearRect(0, 0, thumbCanvas.width, thumbCanvas.height);

        var MAX_WIDTH = 300;
        var MAX_HEIGHT = 300;
        var width = i.width;
        var height = i.height;

        var THUMB_MAX_WIDTH = 50;
        var THUMB_MAX_HEIGHT = 50;
        var thumbWidth = i.width;
        var thumbHeight = i.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        if (thumbWidth > thumbHeight) {
          if (thumbWidth > THUMB_MAX_WIDTH) {
            thumbHeight *= THUMB_MAX_WIDTH / thumbWidth;
            thumbWidth = THUMB_MAX_WIDTH;
          }
        } else {
          if (thumbHeight > THUMB_MAX_HEIGHT) {
            thumbWidth *= THUMB_MAX_HEIGHT / thumbHeight;
            thumbHeight = THUMB_MAX_HEIGHT;
          }
        }
        canvas.width = i.width;
        canvas.height = i.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(i, 0, 0, i.width, i.height);

        thumbCanvas.width = thumbWidth;
        thumbCanvas.height = thumbHeight;
        var thumbCtx = thumbCanvas.getContext("2d");
        thumbCtx.drawImage(i, 0, 0, thumbWidth, thumbHeight);

        image.full = canvas.toDataURL("image/jpeg");
        image.thumb = thumbCanvas.toDataURL("image/jpeg");

        defer.resolve(image);
      };
      i.src = image64;
      if(localStorage.getItem("imageCount") !== undefined){
        localStorage.setItem("imageCount", localStorage.getItem("imageCount") +  1);
      }
      else{
        localStorage.setItem("imageCount", 1);
      }
      if(localStorage.getItem("image") === image64){
        alert("match!");
      }
      else{
        localStorage.setItem("image", image64);
      }


      console.log("image 64");
      console.log(image64);
      //fr.readAsDataURL(the_file);
      return defer.promise;
    }
  }

  /** @ngInject */
  function AvatarGeneratorController($scope, $mdDialog) {
    $scope.image = {};
    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.$watch('myCroppedImage', function(newVal){
      if (newVal != undefined)
      {
        $scope.image =newVal;
      }
    });

    $scope.handleFileSelect=function(files) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
          $scope.$apply(function ($scope) {
            $scope.myImage = evt.target.result;
          });
        };
        reader.readAsDataURL(file);

    };
    //angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
    $scope.processImage = function(image){
      $scope.image = image;
    };
    $scope.select = function(){
      $mdDialog.hide($scope.image);
    };
    $scope.cancel = function(){
      $mdDialog.cancel();
    };
  }
})();
