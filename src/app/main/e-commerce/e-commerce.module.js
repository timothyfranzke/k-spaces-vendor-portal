(function ()
{
    'use strict';

    angular
        .module('app.e-commerce',
            [
                // 3rd Party Dependencies

                'datatables',
                'flow',
                'nvd3',

                'uiGmapgoogle-maps',
                'xeditable'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, config)
    {
        // State
        $stateProvider
            .state('app.e-commerce', {
                abstract: true,
                url     : '/e-commerce'
            })
            .state('app.e-commerce.dashboard', {
                url      : '/dashboard',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/e-commerce/views/dashboard/dashboard.html',
                        controller : 'DashboardEcommerceController as vm'
                    }
                },
                resolve  : {
                    Dashboard: function (msApi)
                    {
                        return msApi.resolve('e-commerce.dashboard@get');
                    },
                    PayPeriods: function (msApi)
                    {
                        return msApi.resolve('e-commerce.pay-period@get');
                    }
                },
                bodyClass: 'ecommerce'
            })
            .state('app.e-commerce.products', {
                url      : '/locations',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/e-commerce/views/locations/location.html',
                        controller : 'ProductsController as vm'
                    }
                },
                resolve  : {
                    Products: function (eCommerceService)
                    {
                        return eCommerceService.getProducts();
                    }
                },
                bodyClass: 'e-commerce'
            })
            .state('app.e-commerce.products.add', {
                url      : '/add',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/e-commerce/views/product/tier.html',
                        controller : 'ProductController as vm'
                    }
                },
                resolve: {
                    Product: function (eCommerceService)
                    {
                        return eCommerceService.newProduct();
                    }
                },
                bodyClass: 'e-commerce'
            })
            .state('app.e-commerce.products.detail', {
                url      : '/:id',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/e-commerce/views/product/tier.html',
                        controller : 'ProductController as vm'
                    }
                },
                resolve  : {
                    Product: function ($stateParams, Products, eCommerceService)
                    {
                        return eCommerceService.getProduct($stateParams.id);
                    }
                },
                bodyClass: 'e-commerce'
            })
            .state('app.e-commerce.orders', {
                url      : '/orders',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/e-commerce/views/orders/orders.html',
                        controller : 'OrdersController as vm'
                    }
                },
                resolve  : {
                    Orders: function (eCommerceService)
                    {
                        return eCommerceService.getOrders();
                    },
                    StudentUsers: function(managerService){
                      return managerService.getStudentUsers();
                    },
                    ParentUsers: function(managerService){
                      return managerService.getParentUsers();
                    }
                },
                bodyClass: 'e-commerce'
            })
            .state('app.e-commerce.orders.detail', {
                url      : '/:id',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/e-commerce/views/order/order.html',
                        controller : 'OrderController as vm'
                    }
                },
                resolve  : {
                    Order        : function ($stateParams, Orders, eCommerceService)
                    {
                        return eCommerceService.getOrder($stateParams.id);
                    },
                    OrderStatuses: function (eCommerceService)
                    {
                        return eCommerceService.getOrderStatuses();
                    },
                    StudentUsers: function(managerService){
                      return managerService.getStudentUsers();
                    }
                },
                bodyClass: 'e-commerce'
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/e-commerce');

        // Api
        msApiProvider.register('e-commerce.dashboard', ['app/data/financial/dashboard.json']);
        msApiProvider.register('e-commerce.pay-period', [config.api.baseUrl + config.api.financial + config.api.payPeriod]);
        msApiProvider.register('e-commerce.tuition_rate', [config.api.baseUrl + config.api.financial + config.api.tuitionRate]);
        msApiProvider.register('e-commerce.orders', [config.api.baseUrl + config.api.financial + config.api.payPeriod]);
        msApiProvider.register('e-commerce.order-statuses', ['app/data/financial/order-statuses.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('financial', {
            title : 'Financial',
            icon  : 'icon-cart',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('financial.dashboard', {
            title: 'Dashboard',
            state: 'app.e-commerce.dashboard'
        });

/*        msNavigationServiceProvider.saveItem('e-commerce.tuition_rates', {
            title: 'Tuition Rates',
            state: 'app.e-commerce.products'
        });*/

        msNavigationServiceProvider.saveItem('financial.orders', {
            title: 'Payments',
            state: 'app.e-commerce.orders'
        });
    }
})();
