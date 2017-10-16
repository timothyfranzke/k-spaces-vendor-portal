(function () {
  'use strict';

  angular
    .module('app.avatar-generator')
    .controller('AvatarGeneratorController', AvatarGeneratorController);

  /** @ngInject */
  function AvatarGeneratorController($scope, $mdDialog) {

    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.$watch('myCroppedImage', function(newVal){

      if (newVal != undefined)
      {
        $scope.image = newVal;
      }
    });

    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);


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
});
