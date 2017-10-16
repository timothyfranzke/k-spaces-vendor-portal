(function ()
{
    'use strict';

    angular
        .module('app.toolbar', ['app.configuration'])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider)
    {

        $translatePartialLoaderProvider.addPart('app/toolbar');
    }
})();
