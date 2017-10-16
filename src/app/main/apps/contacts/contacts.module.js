(function ()
{
    'use strict';

    angular
        .module('app.contacts',
            [
                // 3rd Party Dependencies
                'xeditable',
                'app.configuration'
            ]
        )
        .config(configuration);

    /** @ngInject */
    function configuration($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, config)
    {

        $stateProvider.state('app.contacts', {
            url    : '/contacts',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/apps/contacts/contacts.html',
                    controller : 'ContactsController as vm'
                }
            },
            resolve: {
                Contacts: function (msApi)
                {
                    return msApi.resolve('contacts.contacts@get');
                },
                User: function (msApi)
                {
                    return msApi.resolve('contacts.user@get');
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/contacts');

        // Api
        msApiProvider.register('contacts.contacts', [config.api.baseUrl + config.api.user]);
        msApiProvider.register('contacts.user', [config.api.baseUrl + config.api.userGroup]);


/*
        // Navigation
        msNavigationServiceProvider.saveItem('apps.contacts', {
            title : 'Contacts',
            icon  : 'icon-account-box',
            state : 'app.contacts',
            weight: 10
        });
*/

    }

})();
