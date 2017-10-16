(function ()
{
  'use strict';

  angular
    .module('app.manager')
    .controller('UserController', UserController);

  /** @ngInject */
  function UserController($state, User, Students, managerService, CommonService, avatarGeneratorService)
  {
    console.log("location detail controller");
    var vm = this;
    vm.isRoleSet = false;
    vm.searchText = "";
    vm.searchedStudents = [];

    // Data
    if(CommonService.isEmptyObject(managerService.getTyingId()))
    {
      vm.user = User;
      console.log("new user");
    }
    else{
      //if user is parent and student was just created
      console.log(managerService.getTyingId);
      var userObject = managerService.getInProgressUser();
      vm.user = userObject.user;
      vm.image = userObject.image;
      vm.user.students.push(managerService.getLastCreatedId());
      managerService.setInProgressUser({});
      managerService.setTyingId('');
    }
    if(!CommonService.isEmptyObject(managerService.getInProgressUser())){
      vm.user.role = "student";
      vm.isRoleSet = true;
    }

    console.log(vm.image);
    vm.roles = ["parent","faculty","student"];
    vm.requireLogin = false;
    vm.students = Students;
    vm.parentStudents = [];
    var index = 0;
    var index_two = 0;

    if(!CommonService.isEmptyObject(vm.user.students))
    {
      vm.user.students.forEach(function(studentId){
        console.log("looking for student: " + studentId);
        console.log("students:");
        console.log(Students);

        Students.forEach(function(student){
          if(student._id === studentId){
            vm.parentStudents.push(student);
            vm.students.splice(index,1);
          }
          index++;
        });
        index_two++;
      });
    }

    // Methods
    /*    vm.gotoLocations = gotoLocations();
     vm.gotoSpacesDetail = gotoSpacesDetail;*/
    //vm.updateLocation = updateLocation;
    vm.saveUser = saveUser;
    vm.createAvatar = createAvatar;
    vm.selectStudent = selectStudent;
    vm.removeStudentFromParent = removeStudentFromParent;
    vm.goCreateStudent = goCreateStudent;
    vm.search         = search;
    //////////

    /**
     * Save product
     */
    function saveUser()
    {
      // Since we have two-way binding in place, we don't really need
      // this function to update the locations array in the demo.
      // But in real world, you would need this function to trigger
      // an API call to update your database.
      if ( vm.user._id )
      {
        managerService.updateUser(vm.user._id, vm.user, vm.image);
      }
      else
      {
        var requiredLogin = vm.user.role != 'student';
        managerService.createUser(vm.user, vm.image, requiredLogin);
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
        vm.user.hasImage = true;
        avatarGeneratorService.resizeImage(image)
          .then(function(res){
            console.log(res);
            vm.image = res;
          })
      })
    }

    function selectStudent(student){
      if(!CommonService.isEmptyObject(vm.selectedStudent))
      {
        if(vm.selectedStudent._id !== null && vm.selectedStudent._id !== undefined)
        {
          vm.parentStudents.push(vm.selectedStudent);
          vm.user.students.push(vm.selectedStudent._id);
          console.log(vm.user);

          index = 0;
          vm.students.forEach(function(student){
            if(student._id === vm.selectedStudent._id)
            {
              vm.students.splice(index, 1);
            }
            index++;
          });
        }
      }
    }

    function removeStudentFromParent(id){
      index = 0;
      vm.parentStudents.forEach(function(student){
        if(student._id === id)
        {
          vm.students.push(student);
          vm.parentStudents.splice(index,1);
        }
        index ++;
      });

      index = 0;
      vm.user.students.forEach(function(student){
        if(student === id)
        {
          vm.user.students.splice(index, 1);
        }
        index ++;
      })
    }

    function goCreateStudent(){
      var userObject = {
        user: vm.user,
        image: vm.image
      };
      managerService.setInProgressUser(userObject);
      $state.go($state.current, {}, {reload: true});
    }

    function search(text) {
      vm.searchedStudents = CommonService.searchUser(text, Students);
    }
  }
})();
