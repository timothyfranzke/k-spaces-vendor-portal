(function () {
  'use strict';

  angular
    .module('app.avatar-generator')
    .controller('AvatarGeneratorDirectiveController',AvatarGeneratorDirectiveController)
    .directive('avatarGenerator', AvatarGeneratorDirective);

  function AvatarGeneratorDirective(){
    return {
      restrict: 'E',
      scope: {
        callback: '=callback'
      },
      controller:'AvatarGeneratorDirectiveController',
      templateUrl: 'app/main/dialogs/avatar-generator/directives/avatar-generator.html'
    }

  }

  function AvatarGeneratorDirectiveController($scope){
    console.log("directive controller");
    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.upload = function () {
      angular.element(document.querySelector('#fileInput')).click();
    };
    $scope.$watch('myCroppedImage', function(newVal){
      if (newVal != undefined)
      {
        $scope.callback(newVal);
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
  }
});
