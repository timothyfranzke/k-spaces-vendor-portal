(function ()
{
    'use strict';

    angular
        .module('app.manager')
        .factory('managerService', managerService);

    /** @ngInject */
    function managerService($q, $mdToast, msApi, api, CommonService, config, $state, EventEmitter)
    {
      var locations = [],
        spaces = [],
        users = [],
        tiers = [],
        previous = '',
        tyingId = '',
        inProgressUser = {},
        numberOfCalls = 0,
        completedCalls = 0,
        lastCreatedId = 0;
      var event = new EventEmitter();

      //Event Subscribers
      event.on('createImage', createUserImage);
      event.on('userImageCreated', logInfo);
      event.on('completeUserUpdate', completeUserUpdate);
      event.on('updateStudentUser', updateStudent);

      event.on('creatingEvent', function(){
        console.log("createing user");
      });


      var service = {

        getLocations     : getLocations,
        getLocation      : getLocation,
        createLocation    : createLocation,
        updateLocation    : updateLocation,
        newLocation       : newLocation,
        newSpace          : newSpace,
        deleteLocation    : deleteLocation,
        getSpaces         : getSpaces,
        getSpace          : getSpace,
        createSpace       : createSpace,
        updateSpace       : updateSpace,
        deleteSpace       : deleteSpace,
        getUsers          : getUsers,
        getUser           : getUser,
        createUser        : createUser,
        updateUser        : updateUser,
        deleteUser        : deleteUser,
        newUser           : newUser,
        getFacultyUsers   : getFacultyUsers,
        getStudentUsers   : getStudentUsers,
        getParentUsers    : getParentUsers,
        getTiers          : getTiers,
        getTier           : getTier,
        updateTier        : updateTier,
        createTier        : createTier,
        deleteTier        : deleteTier,
        newTier           : newTier,
        setTyingId        : setTyingId,
        getTyingId        : getTyingId,
        getLastCreatedId  : getLastCreatedId,
        setPrevious       : setPrevious,
        getPrevious       : getPrevious,
        setInProgressUser : setInProgressUser,
        getInProgressUser : getInProgressUser
      };

      return service;

      //////////

      /**
       * Get locations
       */
      function getLocations()
      {
        // Create a new deferred object
        var deferred = $q.defer();

        // If we have already loaded the locations,
        // don't do another API call, get them from
        // the array
        if ( locations.length > 0 )
        {
          console.log(locations);
          deferred.resolve(locations);
        }
        // otherwise make an API call and load
        // the locations
        else
        {
          msApi.request('manager.locations@get', {},

            // SUCCESS
            function (response)
            {
              // Store the locations
              locations = response.data;
              console.log("http");
              console.log(locations);
              // Resolve the prom ise
              deferred.resolve(locations);
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
       * Get location by id
       *
       * @param id
       */
      function getLocation(id)
      {
        // Create a new deferred object
        var deferred = $q.defer();

        // Iterate through the locations and find
        // the correct one. This is an unnecessary
        // code as in real world, you would do
        // another API call here to get the product
        // details
        for ( var i = 0; i < locations.length; i++ )
        {
          if ( locations[i]._id === id )
          {
            deferred.resolve(locations[i]);
          }
        }

        return deferred.promise;
      }

      /**
       * Update the location
       *
       * @param id
       * @param product
       */
      function updateLocation(id, location)
      {
        api.location.update({id: id}, location, function(res){
          locations.forEach(function(item){
            if(item._id == id)
            {
              item = location;
            }
          });
          CommonService.setToast("Updated Location", config.toast_types.info);
          $state.go('app.manager.locations');
        }, function(err){
          CommonService.setToast(err, config.toast_types.error);
          $state.go('app.manager.locations');
        });
      }

      /**
       * Returns a default product structure
       */
      function newLocation()
      {
        return {
          "hours": {
            "open": new Date("07/29/1983T08:00:00.000"),
            "close": new Date("07/29/1983T18:00:00.000")
          },
          "days_of_week": {
            "sunday"  : false,
            "monday": true,
            "wednesday": true,
            "thursday": true,
            "friday": true,
            "saturday" :  false
          },
          "name": "",
          "avatar": {
            "thumb":"",
            "full":""
          },
          "spaces":[],
          "hasImage":false
        };
      }

      /**
       * Returns a default product structure
       */
      function newSpace() {
        return {
          "name": "",
          "description": "",
          "categories": [],
          "location": "",
          "tags": [],
          "students":[],
          "faculty" : [],
          "avatar": {
            "thumb":"",
            "full":""
          },
          "required_faculty" : 0,
          "max_students" : 0
        }
      }
      /**
       * Create product
       *
       * @param product
       */
      function createLocation(location, image)
      {
        // This is a dummy function for a demo.
        // In real world, you would do an API
        // call to add new product to your
        // database.

        api.location.save(location, function(res){
          if(!!image)
          {
            var locationId = res.insertedIds[0];
            image.id = locationId;
            api.image.save(image, function(){
              console.log(res);
              location._id = locationId;
              location.avatar.full = config.image.full + image.id + "/" + image.id + ".png";
                location.avatar.thumb = config.image.thumb + image.id + "/thumbs/" + image.id + ".png";

              api.location.update({id: locationId}, location, function(res){
                  locations.unshift(location);
                  CommonService.setToast('Location Created', config.toast_types.info);
                  $state.go('app.manager.locations');
              },
              function(err){
                CommonService.setToast(err, config.toast_types.error);
                $state.go('app.manager.locations');
              });
            },
            function(err){
              CommonService.setToast(err, config.toast_types.error);
              $state.go('app.manager.locations');
            }
            )
          }
          else{
            console.log(res);
            CommonService.setToast('Location Created', config.toast_types.info);
            $state.go('app.manager.locations');
          }
        }, function(err){
          CommonService.setToast(err, config.toast_types.error);
          $state.go('app.manager.locations');
        });
      }
      function deleteLocation(location){
        var index = 0;
        api.location.remove({id: location._id}, function(){
          CommonService.setToast('Location Deleted', config.toast_types.info);
          locations.forEach(function(item){
            if(item._id == location._id)
            {
              item = location;
            }
            else{
              index++;
            }
          });
          locations.splice(index, 1);
        })
      }
      /**
       * Get locations
       */
      function getSpaces()
      {
        // Create a new deferred object
        var deferred = $q.defer();

        // If we have already loaded the locations,
        // don't do another API call, get them from
        // the array
        if ( spaces.length > 0 )
        {
          console.log(spaces);
          deferred.resolve(spaces);
        }
        // otherwise make an API call and load
        // the locations
        else
        {
          msApi.request('manager.spaces@get', {},

            // SUCCESS
            function (response)
            {
              // Store the locations
              spaces = response.data;
              console.log("http spaces");
              console.log(spaces);
              // Resolve the prom ise
              deferred.resolve(spaces);
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
    * Get location by id
    *
    * @param id
    */
    function getSpace(id)
    {
      // Create a new deferred object
      var deferred = $q.defer();

      // Iterate through the locations and find
      // the correct one. This is an unnecessary
      // code as in real world, you would do
      // another API call here to get the product
      // details
      for ( var i = 0; i < spaces.length; i++ )
      {
        if ( spaces[i]._id === id )
        {
          deferred.resolve(spaces[i]);
        }
      }

      return deferred.promise;
    }

      /**
       * Create product
       *
       * @param product
       */
      function createSpace(space, image, students, faculty)
      {
        // This is a dummy function for a demo.
        // In real world, you would do an API
        // call to add new product to your
        // database.

        api.spaces.save(space, function(res){
          if(!!image)
          {
            var spaceId = res.insertedIds[0];
            students.forEach(function(student){
              student.space_id = spaceId;
              api.userDetail.update({id:student._id}, student);
            });
            faculty.forEach(function(faculty){
              faculty.space_id = spaceId;
              api.userDetail.update({id:faculty._id}, faculty);
            });
            image.id = spaceId;
            api.image.save(image, function(){
                console.log(res);
                space._id = spaceId;
                space.avatar.full = config.image.full + image.id + "/" + image.id + ".png";
                space.avatar.thumb = config.image.thumb + image.id + "/thumbs/" + image.id + ".png";


                api.spaces.update({id: spaceId}, space, function(res){
                    spaces.unshift(space);
                    CommonService.setToast(space.name + ' Created Successfully', config.toast_types.info);
                    $state.go('app.manager.spaces');
                  },
                  function(err){
                    CommonService.setToast(err, config.toast_types.error);
                    $state.go('app.manager.spaces');
                  });
              },
              function(err){
                CommonService.setToast(err, config.toast_types.error);
                $state.go('app.manager.spaces');
              }
            )
          }
          else{
            console.log(res);
            CommonService.setToast(space.name + ' Created Successfully', config.toast_types.info);
            $state.go('app.manager.spaces');
          }
        }, function(err){
          CommonService.setToast(err, config.toast_types.error);
          $state.go('app.manager.spaces');
        });
      }

      /**
       * Update the location
       *
       * @param id
       * @param product
       */
      function updateSpace(id, space, students, faculty)
      {
        api.spaces.update({id: id}, space, function(res){
          spaces.forEach(function(item){
            if(item._id == id)
            {
              item = space;
            }
          });
          students.forEach(function(student){
            api.user.update({id:student._id}, student);
          });
          faculty.forEach(function(faculty){
            api.user.update({id:faculty._id}, faculty);
          });
          CommonService.setToast("Updated " + space.name, config.toast_types.info);
          $state.go('app.manager.spaces');
        }, function(err){
          CommonService.setToast(err, config.toast_types.error);
          $state.go('app.manager.spaces');
        });
      }
      function deleteSpace(space){
        var index = 0;
        var deleteIndex = 0;
        api.spaces.remove({id: space._id}, function(){
          CommonService.setToast('Space Deleted', config.toast_types.info);
          spaces.forEach(function(item){
            if(item._id == space._id)
            {
              deleteIndex = index;
            }
            else{
              index++;
            }
          });
          spaces.splice(deleteIndex, 1);
        })
      }
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
        api.userDetail.save(user, function(res){
          var userId = res.insertedIds[0];
          user._id = userId;
          lastCreatedId = userId;
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
          inProgressUser.user.students.push(id);
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
          if(!!image)
          {
            numberOfCalls++;
            createUserImage(image, user);
          }
          lastCreatedId = user._id;
          if(!!image)
          {
            numberOfCalls++;
            createUserImage(image, user);
          }
          if(!!user.students && user.students.length > 0)
          {
            numberOfCalls += user.students.length + 1;
            updateStudentsWithParent(user);
          }
          if (numberOfCalls == 0)
          {
            completeUserUpdate(user);
          }
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
          "students":[],
          "isPrimary":false
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

      /**
       * Get users
       */
      function getParentUsers()
      {
        // Create a new deferred object
        var deferred = $q.defer();
        var parentUsers = [];
        // If we have already loaded the locations,
        // don't do another API call, get them from
        // the array
        if ( users.length > 0 )
        {
          console.log(users);
          users.forEach(function(user){
            if(user.role === 'parent')
            {
              parentUsers.push(user)
            }
          });
          deferred.resolve(parentUsers);
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
                if(user.role === 'parent')
                {
                  parentUsers.push(user)
                }
              });
              // Resolve the prom ise
              deferred.resolve(parentUsers);
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
       * Get Tiers
       */
      function getTiers()
      {
        // Create a new deferred object
        var deferred = $q.defer();

        // If we have already loaded the locations,
        // don't do another API call, get them from
        // the array
        if ( tiers.length > 0 )
        {
          console.log(tiers);
          deferred.resolve(tiers);
        }
        // otherwise make an API call and load
        // the locations
        else
        {
          msApi.request('e-commerce.tuition_rate@get', {},

            // SUCCESS
            function (response)
            {
              // Store the tiers
              tiers = response.data;
              console.log("http");
              console.log(tiers);
              // Resolve the prom ise
              deferred.resolve(tiers);
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
       * Get tier by id
       *
       * @param id
       */
      function getTier(id)
      {
        console.log("looking for tier: " + id);
        // Create a new deferred object
        var deferred = $q.defer();

        // Iterate through the locations and find
        // the correct one. This is an unnecessary
        // code as in real world, you would do
        // another API call here to get the product
        // details
        for ( var i = 0; i < tiers.length; i++ )
        {
          if ( tiers[i]._id === id )
          {
            console.log("found tier");
            deferred.resolve(tiers[i]);
          }
        }

        return deferred.promise;
      }

      /**
       * Update the tier
       *
       * @param id
       * @param tier
       */
      function updateTier(id, tier)
      {
        api.tuition_rate.update({id: id}, tier, function(res){
          tiers.forEach(function(item){
            if(item._id == id)
            {
              item = tier;
            }
          });
          CommonService.setToast("Updated Tier Successfully", config.toast_types.info);
          $state.go('app.manager.tier');
        }, function(err){
          CommonService.setToast(err, config.toast_types.error);
          $state.go('app.manager.tier');
        });
      }

      /**
       * Returns a default product structure
       */
      function newTier()
      {
        return {
          students        : [],
          priceTaxExcl    : 0,
          priceTaxIncl    : 0,
          taxRate         : 0,
          quantity        : 0,
          extraShippingFee: 0,
          active          : false
        };
      }

      /**
       * Create tier
       *
       * @param tier
       */
      function createTier(tier)
      {
        // This is a dummy function for a demo.
        // In real world, you would do an API
        // call to add new product to your
        // database.

        api.tuition_rate.save(tier, function(res){
          // Generate a random id
          tier._id = res.insertedIds[0];

          // Add the product
          tiers.unshift(tier);

          CommonService.setToast('Tier Created', config.toast_types.info);
          $state.go('app.manager.tier');
        }, function(err){
          CommonService.setToast(err, config.toast_types.error);
          $state.go('app.manager.tier');
        });
      }

      function deleteTier(tier){
        var deferred = $q.defer();

        var index = 0;
        var deleteIndex = 0;
        api.tuition_rate.remove({id: tier._id}, function(){
          CommonService.setToast('Tier Deleted', config.toast_types.info);
          tiers.forEach(function(item){
            if(item._id == tier._id)
            {
              console.log("found tier");
              deleteIndex = index;
            }
            else{
              index++;
            }
          });
          tiers.splice(deleteIndex, 1);
          deferred.resolve(tiers);
        });

        return deferred.promise;
      }


      function setTyingId(id){
        tyingId = id;
      }

      function getTyingId(){
        return tyingId;
      }

      function getLastCreatedId(){
        return lastCreatedId;
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
        image.id = CommonService.generateId();

        api.image.save(image, function(res){
            console.log(res);
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
        console.log("Number of Calls: " + numberOfCalls + " Calls Remaining: " + completedCalls);
        console.log(users);
        user.students.forEach(function(childId){
          var ids = {
            "child_id":childId,
            "parent_id":user._id,
            "user":user
          };
          console.log("updating: " + ids.child_id);
          updateStudent(ids);
        })
      }

      function updateStudent(ids){
        console.log("updateStudent called");
        console.log(ids);
      }

      function completeUserUpdate(user){
        console.log("Completed Calls:" + completedCalls + " NumberOfCalls:" + numberOfCalls);
        completedCalls ++;
        if(completedCalls >= numberOfCalls)
        {
          console.log("adding user: ");
          console.log(user);
          var isNewUser = true;
          users.forEach(function(item){
            if(item._id == user._id)
            {
              item = user;
              isNewUser = false;
            }
          });
          if(isNewUser)
          {
            users.unshift(user);
          }
          completedCalls = 0;
          numberOfCalls = 0;
          if(isNewUser){
            CommonService.setToast(user.legal_name.first + ' ' + user.legal_name.last + ' Created Successfully', config.toast_types.info);
          }
          else{
            CommonService.setToast("Updated " + user.legal_name.first + ' ' + user.legal_name.last, config.toast_types.info);
          }
          redirectAfterCreate(user._id);
        }
      }

      function logInfo(obj){
        console.log(obj);
      }

    }
})();
