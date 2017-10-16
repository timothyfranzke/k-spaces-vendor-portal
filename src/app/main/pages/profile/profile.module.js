(function ()
{
    'use strict';

    angular
        .module('app.pages.profile', ['app.configuration'])
        .config(configuration)
        .factory('profileService', profileService);

    /** @ngInject */
    function configuration($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, config)
    {
        $stateProvider.state('app.pages_profile', {
            url      : '/pages/profile',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pages/profile/profile.html',
                    controller : 'ProfileController as vm'
                }
            },
            resolve  : {
/*                Timeline    : function (msApi)
                {
                    return msApi.resolve('profile.timeline@get');
                },*/
                About       : function (msApi)
                {
                    return msApi.resolve('profile.about@get');
                }
                // PhotosVideos: function (msApi)
                // {
                //     return msApi.resolve('profile.photosVideos@get');
                // }
            },
            bodyClass: 'profile'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/profile');

        // Api
        //msApiProvider.register('profile.timeline', ['http://localhost:3002/api/activity']);
        msApiProvider.register('profile.about', [config.api.baseUrl + config.api.profile]);
        //msApiProvider.register('profile.photosVideos', ['app/data/profile/photos-videos.json']);

        // Navigation
/*        msNavigationServiceProvider.saveItem('pages.profile', {
            title : 'Profile',
            icon  : 'icon-account',
            state : 'app.pages_profile',
            weight: 6
        });*/
    }

  /** @ngInject */
  function profileService($q, $mdToast, msApi, api, CommonService, config, $state, EventEmitter) {
    var profile = {};

    var service = {
      getProfile      : getProfile,
      saveProfile     : saveProfile,
      saveUserImage   : saveUserImage
    };

    return service;

    /**
     * Get location by id
     *
     * @param id
     */
    function getProfile(id)
    {
      // Create a new deferred object
      var deferred = $q.defer();

      if(CommonService.isEmptyObject(this.profile)){
        api.profile.get({id: id}, function(res){
          this.profile = res.data;
          deferred.resolve(this.profile);
        })
      }
      else
      {
        deferred.resolve(this.profile);
      }

      return deferred.promise;
    }

    /**
     * Update the location
     *
     * @param id
     * @param product
     */
    function saveProfile(id, user, image)
    {
      api.profile.update({id: id}, user, function(res){
        CommonService.setToast("Updated Profile", config.toast_types.info);
        $state.go('app.pages_profile');
      }, function(err){
        CommonService.setToast(err, config.toast_types.error);
        $state.go('app.pages_profile');
      });
    }

    function saveUserImage(image, user){
      var deferred = $q.defer();
      image.id = CommonService.generateId();
      api.image.save(image, function(res){
          user.avatar = {};
          user.avatar.full = config.image.full + image.id + "/" + image.id + ".png";
          user.avatar.thumb = config.image.thumb + image.id + "/thumbs/" + image.id + ".png";
          user.haseImage = true;
          api.profile.update({id: user._id}, user, function(res){
            deferred.resolve(user);
          });
        }
      );

      return deferred.promise;
    }
  }

})();
