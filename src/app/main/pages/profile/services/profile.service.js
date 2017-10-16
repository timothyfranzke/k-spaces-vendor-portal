(function ()
{
  'use strict';

  angular
    .module('app.pages.profile')
    .factory('profileService', profileService);

  /** @ngInject */
  function profileService($q, $mdToast, msApi, api, CommonService, config, $state, EventEmitter) {
    var profile = {};

    var service = {
      getProfile      : getProfile,
      saveProfile     : saveProfile
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
      var deferred = $q.defer();

      api.profile.update({id: id}, user, function(res){
        CommonService.setToast("Updated " + user.legal_name.first + ' ' + user.legal_name.last, config.toast_types.info);
        deferred.resolve();
      }, function(err){
        CommonService.setToast(err, config.toast_types.error);
        deferred.reject();
      });

      return deferred.promise;
    }
  }


});
