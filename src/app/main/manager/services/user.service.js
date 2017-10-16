(function ()
{
  'use strict';

  angular
    .module('app.manager')
    .factory('usersService', userService);

  /** @ngInject */
  function userService($q, $mdToast, msApi, api, CommonService, config, $state, EventEmitter) {
    var
      users = [],
      previous = '',
      tyingId = '',
      inProgressUser = {},
      numberOfCalls = 0,
      completedCalls = 0;
    var event = new EventEmitter();

    //Event Subscribers
    event.on('createImage', createUserImage);

    var service = {

      getUsers          : getUsers,
      getUser           : getUser,
      createUser        : createUser,
      updateUser        : updateUser,
      deleteUser        : deleteUser,
      newUser           : newUser,
      getFacultyUsers   : getFacultyUsers,
      getStudentUsers   : getStudentUsers,
      setTyingId        : setTyingId,
      getTyingId        : getTyingId,
      setPrevious       : setPrevious,
      getPrevious       : getPrevious,
      setInProgressUser : setInProgressUser,
      getInProgressUser : getInProgressUser
    };

    return service;


    /**
     * Get users
     */
    function getUsers()
    {
      // Create a new deferred object
      var deferred = $q.defer();

      // If we have already loaded the locations,
      // don't do another API call, get them from
      // the array
      if ( users.length > 0 )
      {
        console.log(users);
        deferred.resolve(users);
      }
      // otherwise make an API call and load
      // the locations
      else
      {
        msApi.request('manager.users@get', {},

          // SUCCESS
          function (response)
          {
            // Store the locations
            users = response.data;
            console.log("http");
            console.log(users);
            // Resolve the prom ise
            deferred.resolve(users);
          },

          // ERROR
          function (response)
          {
            // Reject the promise
            deferred.reject(response);
          }
        );
      }

      return deferred.promise;
    }

    /**
     * Get user by id
     *
     * @param id
     */
    function getUser(id)
    {
      // Create a new deferred object
      var deferred = $q.defer();

      // Iterate through the locations and find
      // the correct one. This is an unnecessary
      // code as in real world, you would do
      // another API call here to get the product
      // details
      for ( var i = 0; i < users.length; i++ )
      {
        if ( users[i]._id === id )
        {
          deferred.resolve(users[i]);
        }
      }

      return deferred.promise;
    }

    /**
     * Create product
     *
     * @param product
     */
    function createUser(user, image, requiredLogin)
    {
      // This is a dummy function for a demo.
      // In real world, you would do an API
      // call to add new product to your
      // database.
      if(requiredLogin)
      {
        api.temp_password.get(function(res){
          console.log(res);
          var registerUser = {
            "email" : user.email,
            "password" : res.pw,
            "role" : user.role
          };

          api.register.save(registerUser, function(res){
            user.auth_id = res.id;
            createUserDetail(user, image);
          })
        });
      }
      else{
        createUserDetail(user, image);
      }
    }

    function createUserDetail(user, image){
      event.triggerEvent('creatingEvent');
      api.userDetail.save(user, function(res){
        var userId = res.insertedIds[0];
        image.id = userId;

        if(!!image)
        {
          numberOfCalls++;
          createUserImage(image, user);
        }
        if(user.students.length > 0)
        {
          numberOfCalls += user.students.length + 1;
          updateStudentsWithParent(user);
        }
        if (numberOfCalls == 0)
        {
          user._id = res.insertedIds[0];
          completeUserUpdate(user);
        }
      }, function(err){
        CommonService.setToast(err, config.toast_types.error);
        $state.go('app.manager.users');
      });
    }

    function redirectAfterCreate(id){

      if(!CommonService.isEmptyObject(inProgressUser)){
        tyingId = id;
        inProgressUser.students.push(id);
        $state.go($state.current, {}, {reload: true});
      }
      else {
        $state.go('app.manager.users');
      }

    }

    /**
     * Update the location
     *
     * @param id
     * @param product
     */
    function updateUser(id, user, image)
    {
      api.userDetail.update({id: id}, user, function(res){
        users.forEach(function(item){
          if(item._id == id)
          {
            item = user;
          }
        });
        CommonService.setToast("Updated " + user.legal_name.first + ' ' + user.legal_name.last, config.toast_types.info);
        $state.go('app.manager.users');
      }, function(err){
        CommonService.setToast(err, config.toast_types.error);
        $state.go('app.manager.users');
      });
    }

    function deleteUser(user){
      var index = 0;
      var deleteIndex = 0;
      api.userDetail.remove({id: user._id}, function(){
        CommonService.setToast('User Deleted', config.toast_types.info);
        users.forEach(function(item){
          if(item._id == user._id)
          {
            deleteIndex = index;
          }
          else{
            index++;
          }
        });
        users.splice(deleteIndex, 1);
      })
    }

    function newUser(){
      return {
        "legal_name": {
          "first": "",
          "middle": "",
          "last": ""
        },
        "avatar": {
          "thumb": "",
          "full": ""
        },
        "hasImage": false,
        "nickname": "",
        "company": "",
        "jobTitle": "",
        "email": "",
        "phone": "",
        "address": {
          "lineone":"",
          "linetwo":"",
          "city":"",
          "state":"",
          "zip":0
        },
        "birthday": null,
        "notes": "",
        "tags": [],
        "role": "",
        "active": true,
        "entity_id": "5935ae7ee1a8f49d75658921",
        "space_id": "",
        "tier_id":"",
        "parents":[],
        "students":[]
      }
    }
    /**
     * Get users
     */
    function getFacultyUsers()
    {
      // Create a new deferred object
      var deferred = $q.defer();
      var facultyUsers = [];
      // If we have already loaded the locations,
      // don't do another API call, get them from
      // the array
      if ( users.length > 0 )
      {
        console.log(users);
        users.forEach(function(user){
          if(user.role === 'faculty')
          {
            facultyUsers.push(user)
          }
        });
        console.log('done faculty');
        deferred.resolve(facultyUsers);
      }
      // otherwise make an API call and load
      // the locations
      else
      {
        msApi.request('manager.users@get', {},

          // SUCCESS
          function (response)
          {
            // Store the locations
            users = response.data;
            users.forEach(function(user){
              if(user.role === 'faculty')
              {
                facultyUsers.push(user)
              }
            });
            console.log('done faculty');
            // Resolve the prom ise
            deferred.resolve(facultyUsers);
          },

          // ERROR
          function (response)
          {
            // Reject the promise
            deferred.reject(response);
          }
        );
      }

      return deferred.promise;
    }
    /**
     * Get users
     */
    function getStudentUsers()
    {
      // Create a new deferred object
      var deferred = $q.defer();
      var studentUsers = [];
      // If we have already loaded the locations,
      // don't do another API call, get them from
      // the array
      if ( users.length > 0 )
      {
        console.log(users);
        users.forEach(function(user){
          if(user.role === 'student')
          {
            studentUsers.push(user)
          }
        });
        deferred.resolve(studentUsers);
      }
      // otherwise make an API call and load
      // the locations
      else
      {
        msApi.request('manager.users@get', {},

          // SUCCESS
          function (response)
          {
            // Store the locations
            users = response.data;
            users.forEach(function(user){
              if(user.role === 'student')
              {
                studentUsers.push(user)
              }
            });
            // Resolve the prom ise
            deferred.resolve(studentUsers);
          },

          // ERROR
          function (response)
          {
            // Reject the promise
            deferred.reject(response);
          }
        );
      }

      return deferred.promise;
    }

    function setTyingId(id){
      tyingId = id;
    }

    function getTyingId(){
      return tyingId;
    }

    function setPrevious(url){
      previous = url;
    }

    function getPrevious(){
      return previous;
    }

    function setInProgressUser(user){
      inProgressUser = user;
    }

    function getInProgressUser(){
      return inProgressUser;
    }


    function createUserImage(image, user){
      api.image.save(image, function(){
          console.log(res);
          user._id = image.id;
          user.avatar.full = config.image.full + image.id + "/" + image.id + ".png";
          user.avatar.thumb = config.image.thumb + image.id + "/thumbs/" + image.id + ".png";

          api.userDetail.update({id: user._id}, user, function(res){
            completeUserUpdate(user);
          });
        }
      )
    }

    function updateStudentsWithParent(user){
      numberOfCalls = user.students.length;
      user.students.forEach(function(childId){
        var childUser = getUser(childId);
        childUser.parents.push(user._id);
        api.userDetail.update({id:childId}, childUser, function(studentUpdateResult){
          completeUserUpdate(user);
        })
      })
    }

    function completeUserUpdate(user){
      completedCalls ++;
      if(completedCalls == numberOfCalls)
      {
        CommonService.setToast(user.legal_name.first + ' ' + user.legal_name.last + ' Created Successfully', config.toast_types.info);
        redirectAfterCreate(user._id);
      }
    }

    function logInfo(obj){
      console.log(obj);
    }
  }

});
