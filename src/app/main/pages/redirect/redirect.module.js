(function ()
{
  'use strict';

  angular
    .module('app.pages.redirect', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider)
  {
    $stateProvider.state('app.pages_redirect', {
      url      : '/pages/redirect/:id',
      views    : {
        'content@app': {
          templateUrl: 'app/main/pages/redirect/redirect.html',
          controller : 'RedirectController as vm'
        }
      },
      bodyClass: 'redirect'
    });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/pages/redirect');
  }

})();
