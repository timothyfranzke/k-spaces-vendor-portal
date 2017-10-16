(function ()
{
  'use strict';

  angular
    .module('app.manager')
    .controller('SpacesController', SpacesController);

  /** @ngInject */
  function SpacesController($state, $mdDialog, Spaces, CommonService, managerService)
  {
    var vm = this;

    // Data
    vm.spaces = Spaces;
    console.log("SpacesController controller");

    vm.dtInstance = {};
    vm.dtOptions = {
      dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      columnDefs  : [
        {
          // Target the id column
          targets: 0,
          width  : '72px'
        },
        {
          // Target the image column
          targets   : 1,
          filterable: true,
          sortable  : true
        },
        {
          // Target the image column
          targets   : 2,
          filterable: true,
          sortable  : true,
          width     : '150px'
        },
        {
          // Target the actions column
          targets           : 2,
          responsivePriority: 1,
          filterable        : true,
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
    vm.goToSpaceDetail = goToSpaceDetail;
    vm.gotoSpaceCreate = gotoSpaceCreate;
    vm.deleteSpace     = deleteSpace;
    //////////

    /**
     * Go to product detail
     *
     * @param id
     */
    function goToSpaceDetail(id)
    {
      console.log("Space ID: " + id);
      $state.go('app.manager.spaces.detail', {id: id});
    }

    //////////

    /**
     * Go to product detail
     *
     * @param id
     */
    function gotoSpaceCreate()
    {
      $state.go('app.manager.spaces.add');
    }

    //////////

    /**
     * Delete the location
     *
     * @param id
     */
    function deleteSpace(space, ev)
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete this space?')
        .htmlContent('<b>' + space.name + '</b>' + ' will be deleted.')
        .ariaLabel('delete space')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {
        managerService.deleteSpace(space);
        vm.spaces = managerService.getSpaces();
      }, function ()
      {

      });
    }
  }
})();
