(function ()
{
    'use strict';

    angular
        .module('app.e-commerce')
        .factory('eCommerceService', eCommerceService);

    /** @ngInject */
    function eCommerceService($q, $mdToast, msApi, api, CommonService, config, $state, managerService)
    {
        var products = [],
            order = {},
            orders = [],
            orderStatuses = [],
            payPeriods = [];

        var service = {
            getProducts     : getProducts,
            getProduct      : getProduct,
            updateProduct   : updateProduct,
            newProduct      : newProduct,
            createProduct   : createProduct,
            getOrders       : getOrders,
            getOrder        : getOrder,
            getOrderStatuses: getOrderStatuses,
            getPayPeriod    : getPayPeriod,
            getSavedOrder   : getSavedOrder,
            setOrder        : setOrder
        };

        return service;

        //////////

        /**
         * Get locations
         */
        function getProducts()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            // If we have already loaded the locations,
            // don't do another API call, get them from
            // the array
            if ( products.length > 0 )
            {
                console.log(products);
                deferred.resolve(products);
            }
            // otherwise make an API call and load
            // the locations
            else
            {
                msApi.request('e-commerce.tuition_rate@get', {},

                    // SUCCESS
                    function (response)
                    {
                        // Store the locations
                        products = response.data;
                        console.log("http");
                        console.log(products);
                        // Resolve the prom ise
                        deferred.resolve(products);
                    },

                    // ERROR
                    function (response)
                    {
                        // Reject the promise
                        deferred.reject(response);
                    }
                );
            }

            return deferred.promise;
        }

        /**
         * Get product by id
         *
         * @param id
         */
        function getProduct(id)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            // Iterate through the locations and find
            // the correct one. This is an unnecessary
            // code as in real world, you would do
            // another API call here to get the product
            // details
            for ( var i = 0; i < products.length; i++ )
            {
                if ( products[i]._id === id )
                {
                    deferred.resolve(products[i]);
                }
            }

            return deferred.promise;
        }

        /**
         * Update the product
         *
         * @param id
         * @param product
         */
        function updateProduct(id, product)
        {
          api.tuition_rate.update({id: id}, product, function(res){
            products.forEach(function(item){
              if(item._id == id)
              {
                item = product;
              }
            });
            CommonService.setToast("Updated Tier Successfully", config.toast_types.info);
            $state.go('app.e-commerce.products');
          }, function(err){
            CommonService.setToast(err, config.toast_types.error);
            $state.go('app.e-commerce.products');
          });
        }

        /**
         * Returns a default product structure
         */
        function newProduct()
        {
            return {
                students        : [],
                priceTaxExcl    : 0,
                priceTaxIncl    : 0,
                taxRate         : 0,
                quantity        : 0,
                extraShippingFee: 0,
                active          : false
            };
        }

        /**
         * Create product
         *
         * @param product
         */
        function createProduct(product)
        {
            // This is a dummy function for a demo.
            // In real world, you would do an API
            // call to add new product to your
            // database.

            api.tuition_rate.save(product, function(){
              // Generate a random id
              product.id = Math.floor((Math.random() * 10) + 1);

              // Add the product
              products.unshift(product);

              CommonService.setToast('Tier Created', config.toast_types.info);
              $state.go('app.e-commerce.products');
            }, function(err){
              CommonService.setToast(err, config.toast_types.error);
              $state.go('app.e-commerce.products');
            });


        }

        /**
         * Get orders
         */
        function getOrders()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            // If we have already loaded the orders,
            // don't do another API call, get them from
            // the array
            if ( orders.length > 0 )
            {
                deferred.resolve(orders);
            }
            // otherwise make an API call and load
            // the orders
            else
            {
                msApi.request('e-commerce.orders@get', {},

                    // SUCCESS
                    function (response)
                    {
                      managerService.getParentUsers().then(function(parentUsers){
                         managerService.getStudentUsers().then(function(studentUsers){
                           response.data.forEach(function(order){
                             console.log("order:");
                             console.log(order);
                             studentUsers.forEach(function(student){
                               if(order.student_id === student._id){
                                 var parentFound = false;
                                 var parentObject = {};
                                 orders.forEach(function(parent){
                                   if(student.parents !== undefined || student.parents !== null){
                                     if(student.parents.includes(parent._id)){
                                       parentFound = true;
                                       parentObject = parent;
                                     }
                                   }
                                 });
                                 if(!parentFound){
                                   parentUsers.forEach(function(parent){
                                     if(student.parents !== undefined || student.parents !== null){
                                       if(student.parents.includes(parent._id.toString())){
                                         //find the payment object
                                         parentObject = parent;
                                       }
                                     }
                                   });
                                 }

                                 if(order.student_id == student._id){
                                   var studentObject = student;
                                   studentObject.total = order.total;
                                   if(parentObject.students === undefined)
                                   {
                                     parentObject.students = [];
                                   }
                                   parentObject.students.push(studentObject);
                                   if(parentObject.total === undefined){
                                     parentObject.total = 0;
                                   }
                                   parentObject.total += order.total;
                                 }
                                 if(!parentFound)
                                 {
                                   orders.push(parentObject);
                                 }
                               }
                             });

                           });
                           console.log("completed orders:");
                           console.log(orders);
                           deferred.resolve(orders);
                         });
                      });
                    },

                    // ERROR
                    function (response)
                    {
                        // Reject the promise
                        deferred.reject(response);
                    }
                );
            }

            return deferred.promise;
        }

        function setOrder(order){
          this.order = order;
        }

        function getSavedOrder(){
          return this.order;
        }

        /**
         * Get order by id
         *
         * @param id
         */
        function getOrder(id)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            // Iterate through the orders and find
            // the correct one. This is an unnecessary
            // code as in real world, you would do
            // another API call here to get the order
            // details
            for ( var i = 0; i < orders.length; i++ )
            {
                if ( orders[i]._id === id )
                {
                    deferred.resolve(orders[i]);
                }
            }

            return deferred.promise;
        }

        /**
         * Get order statuses
         */
        function getOrderStatuses()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            // If we have already loaded the order statuses,
            // don't do another API call, get them from
            // the array
            if ( orderStatuses.length > 0 )
            {
                deferred.resolve(orderStatuses);
            }
            // otherwise make an API call and load
            // the order statuses
            else
            {
                msApi.request('e-commerce.order-statuses@get', {},

                    // SUCCESS
                    function (response)
                    {
                        // Store the order statuses
                        orderStatuses = response.data;

                        // Resolve the promise
                        deferred.resolve(orderStatuses);
                    },

                    // ERROR
                    function (response)
                    {
                        // Reject the promise
                        deferred.reject(response);
                    }
                );
            }

            return deferred.promise;
        }
      /**
       * Get order by id
       *
       * @param id
       */
      function getPayPeriod(id)
      {
        // Create a new deferred object
        var deferred = $q.defer();

        // Iterate through the orders and find
        // the correct one. This is an unnecessary
        // code as in real world, you would do
        // another API call here to get the order
        // details
        console.log("getPayPeriod()");
        console.log(id);
        if(payPeriods.length === 0){
          console.log("id not found");
          api.payPeriod.get({'id':id}, function(res){
            var payPeriodObject = {
              periodID : id,
              data : res
            };
            payPeriods.push(payPeriodObject);
            deferred.resolve(res);
          });
        }
        else{
          for ( var i = 0; i < payPeriods.length; i++ )
          {
            if ( payPeriods[i].periodID === id )
            {
              deferred.resolve(payPeriods[i].data);
            }
            else {
              console.log("id not found");
              api.payPeriod.get({'id':id}, function(res){
                var payPeriodObject = {
                  periodID : id,
                  data : res
                };
                payPeriods.push(payPeriodObject);
                deferred.resolve(res);
              });
            }
          }
        }


        return deferred.promise;
      }
    }

})();
