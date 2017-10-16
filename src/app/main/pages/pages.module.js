(function ()
{
  'use strict';

  angular
    .module('app.pages', [
      'app.pages.profile',
      'app.pages.redirect'
    ])
    .config(configuration);

  /** @ngInject */
  function configuration(msNavigationServiceProvider)
  {
    // Navigation
/*    msNavigationServiceProvider.saveItem('pages', {
      group : true,
      weight: 2
    });*/
  }
})();
