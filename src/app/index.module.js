(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            //Pages
            'app.pages',

            // Apps
            'app.calendar',
            'app.contacts',
            'app.chat',
            'app.e-commerce',
            'app.mail',
            'app.notes',
            'app.configuration',
            'app.manager',
            //Services
            'app.common',
            'app.avatar-generator'
        ]);
})();
