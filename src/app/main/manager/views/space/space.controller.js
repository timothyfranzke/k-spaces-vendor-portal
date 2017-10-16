(function ()
{
  'use strict';

  angular
    .module('app.manager')
    .controller('SpaceDetailController', SpaceDetailController);

  /** @ngInject */
  function SpaceDetailController($state, Locations, Space, StudentUsers, FacultyUsers, managerService, avatarGeneratorService)
  {
    var vm = this;

    // Data
    vm.space = Space;
    vm.locations = Locations;
    vm.studentUsers = StudentUsers;
    vm.facultyUsers = FacultyUsers;
    vm.spaceFaculty = [];
    vm.spaceStudents = [];
    vm.removedFaulty = [];
    vm.selectedFaculty = null;
    vm.selectedStudent = null;
    var updatedFacultyUsers = [];
    var updatedStudentUsers = [];
    var index = 0;
    StudentUsers.forEach(function(student){
      if(student.space_id === Space._id && Space._id != undefined){
        console.log("space id" + Space._id);
        console.log("student space id" + student.space_id);
        vm.spaceStudents.push(student);
        vm.studentUsers.splice(index,1);
      }
      index++;
    });
    index = 0;
    FacultyUsers.forEach(function(faculty){
      if(faculty.space_id === Space._id && Space._id != undefined){
        vm.spaceFaculty.push(faculty);
        vm.facultyUsers.splice(index, 1);
      }
      index++;
    });

    vm.dtInstance = {};
    vm.dtOptions = {
      dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs  : [
        {
          // Target the id column
          targets: 0,
          width  : '72px'
        },
        {
          // Target the image column
          targets   : 1,
          filterable: true,
          sortable  : true
        },
        {
          // Target the actions column
          targets           : 2,
          responsivePriority: 1,
          filterable        : false,
          sortable          : false
        }
      ],
      pagingType  : 'simple',
      lengthMenu  : [10, 20, 30, 50, 100],
      pageLength  : 20,
      scrollY     : 'auto',
      responsive  : true
    };
    // Methods
    /*    vm.gotoLocations = gotoLocations();
     vm.gotoSpacesDetail = gotoSpacesDetail;*/
    //vm.updateLocation = updateLocation;
    vm.saveSpace = saveSpace;
    vm.createAvatar = createAvatar;
    vm.gotoSpaces = gotoSpaces;
    vm.selectFaculty = selectFaculty;
    vm.selectStudent = selectStudent;
    vm.removeFacultyFromSpace = removeFacultyFromSpace;
    vm.removeStudentFromSpace = removeStudentFromSpace;

    //////////
    /**
     * Go to orders page
     */
    function gotoSpaces()
    {
      $state.go('app.manager.spaces');
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
    function saveSpace()
    {
      // Since we have two-way binding in place, we don't really need
      // this function to update the locations array in the demo.
      // But in real world, you would need this function to trigger
      // an API call to update your database.
      if ( vm.space._id )
      {
        managerService.updateSpace(vm.space._id, vm.space, vm.spaceStudents, vm.facultyUsers);
      }
      else
      {
        managerService.createSpace(vm.space, vm.image, vm.spaceStudents, vm.facultyUsers);
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
        vm.space.hasImage = true;
        avatarGeneratorService.resizeImage(image)
          .then(function(res){
            vm.image = res;
          })
      })
    }

    function selectFaculty(faculty){
      console.log(selectFaculty);
      if(vm.selectedItem._id !== null && vm.selectedItem._id !== undefined)
      {
        vm.spaceFaculty.push(vm.selectedItem);
        vm.space.faculty.push(vm.selectedItem._id);
        vm.spaceFaculty.forEach(function(item){
          console.log(item)
        });
        index = 0;
        vm.facultyUsers.forEach(function(faculty){
          if(faculty._id === vm.selectedItem._id)
          {
            vm.facultyUsers.splice(index, 1);
          }
          index++;
        });
      }
    }

    function selectStudent(student){
      if(vm.selectedStudent._id !== null && vm.selectedStudent._id !== undefined)
      {
        vm.spaceStudents.push(vm.selectedStudent);
        vm.space.students.push(vm.selectedStudent._id);

        index = 0;
        vm.spaceStudents.forEach(function(student){
          if(student._id === vm.selectedItem._id)
          {
            vm.studentUsers.splice(index, 1);
          }
          index++;
        });
      }
    }

    function removeFacultyFromSpace(id){
      index = 0;
      vm.spaceFaculty.forEach(function(faculty){
        if(faculty._id === id)
        {
          vm.facultyUsers.push(faculty);
          vm.spaceFaculty.splice(index,1);
        }
        index ++;
      });

      index = 0;
      vm.space.faculty.forEach(function(faculty){
        if(faculty === id)
        {
          vm.space.faculty.splice(index, 1);
        }
        index ++;
      })
    }
    function removeStudentFromSpace(id){
      index = 0;
      vm.spaceStudents.forEach(function(student){
        if(student._id === id)
        {
          vm.studentUsers.push(student);
          vm.spaceStudents.splice(index,1);
        }
        index ++;
      });

      index = 0;
      vm.space.students.forEach(function(student){
        if(student === id)
        {
          vm.space.students.splice(index, 1);
        }
        index ++;
      })
    }
  }
})();
