(function ()
{
    'use strict';

    angular
        .module('app.manager')
        .controller('TiersController', TiersController);

    /** @ngInject */
    function TiersController($state, Tiers, $mdDialog, managerService)
    {
        var vm = this;

        // Data
        vm.products = Tiers;

        vm.dtInstance = {};
        vm.dtOptions = {
            dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs  : [
                {
                    // Target the price column
                    targets: 3,
                    render : function (data, type)
                    {
                        if ( type === 'display' )
                        {
                            return '<div class="layout-align-start-start layout-row">' + '<i></i>' + '<span>' + data + '</span>' + '</div>';
                        }

                        return data;
                    }
                },
                {
                    // Target the quantity column
                    targets: 4,
                    render : function (data, type)
                    {
                        /*if ( type === 'display' )
                        {
                            if ( parseInt(data) <= 5 )
                            {
                                return '<div class="quantity-indicator md-red-500-bg"></div><div>' + data + '</div>';
                            }
                            else if ( parseInt(data) > 5 && parseInt(data) <= 25 )
                            {
                                return '<div class="quantity-indicator md-amber-500-bg"></div><div>' + data + '</div>';
                            }
                            else
                            {
                                return '<div class="quantity-indicator md-green-600-bg"></div><div>' + data + '</div>';
                            }
                        }*/

                        return data;
                    }
                },
                /*{
                    // Target the status column
                    targets   : 5,
                    filterable: false,
                    render    : function (data, type)
                    {
                        if ( type === 'display' )
                        {
                            if ( data === 'true' )
                            {
                                return '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
                            }

                            return '<i class="icon-cancel red-500-fg"></i>';
                        }

                        if ( type === 'filter' )
                        {
                            if ( data )
                            {
                                return '1';
                            }

                            return '0';
                        }

                        return data;
                    }
                },*/
                {
                    // Target the actions column
                    targets           : 5,
                    responsivePriority: 1,
                    filterable        : false,
                    sortable          : false
                }
            ],
            initComplete: function ()
            {
                var api = this.api(),
                    searchBox = angular.element('body').find('#e-commerce-locations-search');

                // Bind an external input as a table wide search box
                if ( searchBox.length > 0 )
                {
                    searchBox.on('keyup', function (event)
                    {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType  : 'simple',
            lengthMenu  : [10, 20, 30, 50, 100],
            pageLength  : 20,
            scrollY     : 'auto',
            responsive  : true
        };

        // Methods
        vm.gotoAddProduct = gotoAddProduct;
        vm.gotoProductDetail = gotoProductDetail;
        vm.deleteTier = deleteTier;

        //////////

        /**
         * Go to add product
         */
        function gotoAddProduct()
        {
            $state.go('app.manager.tier.add');
        }

        /**
         * Go to product detail
         *
         * @param id
         */
        function gotoProductDetail(id)
        {
            console.log(id);
            $state.go('app.manager.tier.detail', {id: id});
        }

      function deleteTier(tier, ev, index)
      {
        var confirm = $mdDialog.confirm()
          .title('Are you sure want to delete this user?')
          .htmlContent('<b>' + tier.name + '</b>' + ' will be deleted.')
          .ariaLabel('delete user')
          .targetEvent(ev)
          .ok('OK')
          .cancel('CANCEL');

        $mdDialog.show(confirm).then(function ()
        {
          managerService.deleteTier(tier).then(function(res){
            vm.products.splice(index, 1);
          });

        }, function ()
        {

        });
      }
    }
})();
