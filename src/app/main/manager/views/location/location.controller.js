(function ()
{
  'use strict';

  angular
    .module('app.manager')
    .controller('LocationDetailController', LocationDetailController);

  /** @ngInject */
  function LocationDetailController($state, Location, Spaces, managerService, avatarGeneratorService)
  {
    console.log("location detail controller");
    var vm = this;

    // Data
    vm.location = Location;
    vm.spaces = Spaces;
    vm.locationSpaces = [];
    vm.selectedSpace = {};
    var index = 0;
    Spaces.forEach(function(space){
      if(space.location_id === Location._id && Location._id != undefined){
        vm.locationSpaces.push(space);
        vm.spaces.splice(index, 1);
      }
      index++;
    });

    vm.location.hours.close = new Date(vm.location.hours.close);
    vm.location.hours.open = new Date(vm.location.hours.open);
    console.log(Location);
    // Methods
/*    vm.gotoLocations = gotoLocations();
    vm.gotoSpacesDetail = gotoSpacesDetail;*/
    //vm.updateLocation = updateLocation;
    vm.saveLocation = saveLocation;
    vm.createAvatar = createAvatar;
    vm.selectSpace = selectSpace;
    vm.removeSpaceFromLocation = removeSpaceFromLocation;
    //////////
    /**
     * Go to orders page
     */
    function gotoLocations()
    {
      $state.go('app.manager.locations');
    }

    /**
     * Go to product page
     * @param id
     */
    function gotoSpacesDetail(id)
    {
      $state.go('app.manager.spaces.detail', {id: id});
    }

    /**
     * Save product
     */
    function saveLocation()
    {
      // Since we have two-way binding in place, we don't really need
      // this function to update the locations array in the demo.
      // But in real world, you would need this function to trigger
      // an API call to update your database.
      if ( vm.location._id )
      {
        managerService.updateLocation(vm.location._id, vm.location);
      }
      else
      {
        managerService.createLocation(vm.location, vm.image);
    }

    }

    /**
     * Checks if the given form valid
     *
     * @param formName
     */
    function isFormValid(formName)
    {
      if ( $scope[formName] && $scope[formName].$valid )
      {
        return $scope[formName].$valid;
      }
    }

    function createAvatar(){
      avatarGeneratorService.avatarGenerator(function(image){
        vm.location.hasImage = true;
        avatarGeneratorService.resizeImage(image)
          .then(function(res){
            vm.image = res;
          })
      })
    }

    function selectSpace(){
      if(vm.selectedSpace._id !== null && vm.selectedSpace._id !== undefined)
      {
        vm.locationSpaces.push(vm.selectedSpace);
        vm.location.spaces.push(vm.selectedSpace._id);
        index = 0;
        vm.spaces.forEach(function(space){
          if(space._id === vm.selectedSpace._id)
          {
            vm.spaces.splice(index, 1);
          }
          index++;
        });
      }
    }

    function removeSpaceFromLocation(id){
      index = 0;
      vm.locationSpaces.forEach(function(space){
        if(space._id === id)
        {
          vm.spaces.push(faculty);
          vm.locationSpaces.splice(index,1);
        }
        index ++;
      });

      index = 0;
      vm.location.spaces.forEach(function(space){
        if(space === id)
        {
          vm.location.space.splice(index, 1);
        }
        index ++;
      })
    }
  }
})();
