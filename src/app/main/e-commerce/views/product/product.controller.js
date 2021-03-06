(function ()
{
    'use strict';

    angular
        .module('app.e-commerce')
        .controller('ProductController', ProductController);

    /** @ngInject */
    function ProductController($scope, $document, $state, eCommerceService, Product, api, CommonService, config)
    {
        var vm = this;

        // Data
        vm.taToolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent', 'html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
        ];
        vm.product = Product;
        eCommerceService.getProducts().then(function(data){
           vm.products = data;
        });
        vm.categoriesSelectFilter = '';
        vm.ngFlowOptions = {
            // You can configure the ngFlow from here
            /*target                   : 'api/media/image',
             chunkSize                : 15 * 1024 * 1024,
             maxChunkRetries          : 1,
             simultaneousUploads      : 1,
             testChunks               : false,
             progressCallbacksInterval: 1000*/
        };
        vm.ngFlow = {
            // ng-flow will be injected into here through its directive
            flow: {}
        };
        vm.dropping = false;
        vm.imageZoomOptions = {};
        vm.items = [];

        vm.occurenceTypes = [
          "Weekly",
          "Bi-monthyl",
          "Monthly (first day)",
          "Monthly (specific day)"
        ];

      vm.dtInstance = {};
      vm.dtTierStudents = {
        dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        columnDefs  : [
          {
            // Target the actions column
            targets           : 2,
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
        vm.saveProduct = saveProduct;
        vm.removeStudent = removeStudent;
        vm.gotoProducts = gotoProducts;
        vm.onCategoriesSelectorOpen = onCategoriesSelectorOpen;
        vm.onCategoriesSelectorClose = onCategoriesSelectorClose;
        vm.fileAdded = fileAdded;
        vm.upload = upload;
        vm.fileSuccess = fileSuccess;
        vm.isFormValid = isFormValid;
        vm.updateImageZoomOptions = updateImageZoomOptions;
        vm.search =search;
        vm.selectItem = selectItem;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
/*            if ( vm.product.images.length > 0 )
            {
                vm.updateImageZoomOptions(vm.product.images[0].url);
            }*/
        }

        /**
         * Save product
         */
        function saveProduct()
        {
            // Since we have two-way binding in place, we don't really need
            // this function to update the locations array in the demo.
            // But in real world, you would need this function to trigger
            // an API call to update your database.
            if ( vm.product._id )
            {
                eCommerceService.updateProduct(vm.product._id, vm.product);
            }
            else
            {
                eCommerceService.createProduct(vm.product);
            }

        }

        /**
         * Go to locations page
         */
        function gotoProducts()
        {
            $state.go('app.e-commerce.products');
        }

        /**
         * On categories selector open
         */
        function onCategoriesSelectorOpen()
        {
            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $document.find('md-select-header input[type="search"]').on('keydown', function (e)
            {
                e.stopPropagation();
            });
        }

        /**
         * On categories selector close
         */
        function onCategoriesSelectorClose()
        {
            // Clear the filter
            vm.categoriesSelectFilter = '';

            // Unbind the input event
            $document.find('md-select-header input[type="search"]').unbind('keydown');
        }

        /**
         * File added callback
         * Triggers when files added to the uploader
         *
         * @param file
         */
        function fileAdded(file)
        {
            // Prepare the temp file data for media list
            var uploadingFile = {
                id  : file.uniqueIdentifier,
                file: file,
                type: 'uploading'
            };

            // Append it to the media list
            vm.product.images.unshift(uploadingFile);
        }

        /**
         * Upload
         * Automatically triggers when files added to the uploader
         */
        function upload()
        {
            // Set headers
            vm.ngFlow.flow.opts.headers = {
                'X-Requested-With': 'XMLHttpRequest',
                //'X-XSRF-TOKEN'    : $cookies.get('XSRF-TOKEN')
            };

            vm.ngFlow.flow.upload();
        }

        /**
         * File upload success callback
         * Triggers when single upload completed
         *
         * @param file
         * @param message
         */
        function fileSuccess(file, message)
        {
            // Iterate through the media list, find the one we
            // are added as a temp and replace its data
            // Normally you would parse the message and extract
            // the uploaded file data from it
            angular.forEach(vm.product.images, function (media, index)
            {
                if ( media.id === file.uniqueIdentifier )
                {
                    // Normally you would update the media item
                    // from database but we are cheating here!
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(media.file.file);
                    fileReader.onload = function (event)
                    {
                        media.url = event.target.result;
                    };

                    // Update the image type so the overlay can go away
                    media.type = 'image';
                }
            });
        }

        /**
         * Checks if the given form valid
         *
         * @param formName
         */
        function isFormValid(formName)
        {
            if ( $scope[formName] && $scope[formName].$valid )
            {
                return $scope[formName].$valid;
            }
        }

        /**
         * Update image zoom options
         *
         * @param url
         */
        function updateImageZoomOptions(url)
        {
            vm.imageZoomOptions = {
                images: [
                    {
                        thumb : url,
                        medium: url,
                        large : url
                    }
                ]
            };
        }

      function search(term){
        console.log("searching " + term);
        api.search.query({term:term}, function(res){
          console.log(res);
          vm.items = res;
        })
      };

      function selectItem(item){
        var allowUpdate = true;
        if(vm.product.students === undefined){
          vm.product.students = [];
        }
        vm.product.students.forEach(function(student){
          if(student._id === item._id){
            allowUpdate = false;
          }
        });
        if(allowUpdate)
        {
          vm.product.students.push(item);
        }
        else{
          CommonService.setToast("Student is already enrolled", config.toast_types.info);
        }
      };

      function removeStudent(id){
        var i = 0;
        var index = 0;
        vm.product.students.forEach(function(student){
          if(student._id == id){
            index = i;
          }
          i++;
        });

        vm.product.students.splice(index, 1);
      }
    }
})();
