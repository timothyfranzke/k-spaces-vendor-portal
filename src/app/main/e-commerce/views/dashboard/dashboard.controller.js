(function ()
{
    'use strict';

    angular
        .module('app.e-commerce')
        .controller('DashboardEcommerceController', DashboardEcommerceController);

    /** @ngInject */
    function DashboardEcommerceController(Dashboard, PayPeriods, eCommerceService)
    {
        var vm = this;

        vm.overdue = {};
        vm.overdue.parents = ["Steve Allee", "Timothy Franzke", "David Franzke", "kaka kaka"];


        // Data
        vm.payPeriods = PayPeriods.data;
        console.log(vm.payPeriods);
        vm.paymentDue = 0;
        vm.paymentCollected = 0;
        vm.paymentTotal = 0;

        vm.threeMthDue = 0;
        vm.threeMthCollected = 0;
        vm.threeMthTotal = 0;

        vm.ytdPaymentDue = 0;
        vm.ytdPaymentCollected = 0;
        vm.ytdPaymentTotal = 0;

        vm.selectedPayPeriod ="";

        eCommerceService.getPayPeriod(PayPeriods.data[0]._id).then(function(res){
          vm.currentPeriod = res.data;
          vm.selectedPayPeriod = vm.currentPeriod._id;
          vm.currentPeriod.forEach(function(record){
            if(vm.paymentTotal === 0){
              vm.paymentTotal = record.total;
            }
            else {
              vm.paymentTotal += parseInt(record.total);
            }
            if(record.status[0].id === 12)
            {
              vm.paymentDue += record.total;
            }
            else {
              vm.paymentCollected += record.total;
            }
          })
        });

        vm.payPeriods.forEach(function(period){
          var thisYear = new Date(new Date().getFullYear(), 0, 1);
          var threeMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1);
          var recordDate = new Date(period.start_date);
          console.log(thisYear);
          console.log(threeMonth);
          console.log(recordDate);
          if(recordDate >= thisYear){
            console.log("Yes " + recordDate + " is greater than " + thisYear);
            eCommerceService.getPayPeriod(period._id).then(function(res){
              vm.currentPeriod = res.data;
              vm.currentPeriod.forEach(function(record){
                if(vm.ytdPaymentTotal === 0){
                  vm.ytdPaymentTotal = record.total;
                }
                else {
                  vm.ytdPaymentTotal += parseInt(record.total);
                }
                if(record.status[0].id === 12)
                {
                  vm.ytdPaymentDue += record.total;
                }
                else {
                  vm.ytdPaymentCollected += record.total;
                }
                if(recordDate >= threeMonth){
                  console.log("Yes " + recordDate + " is greater than " + threeMonth);

                  if(vm.threeMthTotal === 0){
                    vm.threeMthTotal = record.total;
                  }
                  else {
                    vm.threeMthTotal += parseInt(record.total);
                  }
                  if(record.status[0].id === 12)
                  {
                    vm.threeMthDue += record.total;
                  }
                  else {
                    vm.threeMthCollected += record.total;
                  }
                }
              })
            });
          }
        });

        vm.dashboard = Dashboard;

        vm.widget1 = vm.dashboard.widget1;
        vm.widget2 = vm.dashboard.widget2;
        vm.widget3 = vm.dashboard.widget3;
        vm.widget4 = vm.dashboard.widget4;
        vm.widget5 = {
            title       : vm.dashboard.widget5.title,
            mainChart   : {
                config : {
                    refreshDataOnly: true,
                    deepWatchData  : true
                },
                options: {
                    chart: {
                        type        : 'multiBarChart',
                        color       : ['#03a9f4', '#b3e5fc'],
                        height      : 420,
                        margin      : {
                            top   : 8,
                            right : 16,
                            bottom: 32,
                            left  : 32
                        },
                        clipEdge    : true,
                        groupSpacing: 0.3,
                        reduceXTicks: false,
                        stacked     : true,
                        duration    : 250,
                        x           : function (d)
                        {
                            return d.x;
                        },
                        y           : function (d)
                        {
                            return d.y;
                        },
                        yAxis       : {
                            tickFormat: function (d)
                            {
                                return d;
                            }
                        },
                        legend      : {
                            margin: {
                                top   : 8,
                                bottom: 32
                            }
                        },
                        controls    : {
                            margin: {
                                top   : 8,
                                bottom: 32
                            }
                        },
                        tooltip     : {
                            gravity: 's',
                            classes: 'gravity-s'
                        }
                    }
                },
                data   : []
            },
            days        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            ranges      : vm.dashboard.widget5.ranges,
            currentRange: '',
            changeRange : function (range)
            {
                vm.widget5.currentRange = range;

                /**
                 * Update main chart data by iterating through the
                 * chart dataset and separately adding every single
                 * dataset by hand.
                 *
                 * You MUST NOT swap the entire data object by doing
                 * something similar to this:
                 * vm.widget.mainChart.data = chartData
                 *
                 * It would be easier but it won't work with the
                 * live updating / animated charts due to how d3
                 * works.
                 *
                 * If you don't need animated / live updating charts,
                 * you can simplify these greatly.
                 */
                angular.forEach(vm.dashboard.widget5.mainChart, function (chartData, index)
                {
                    vm.widget5.mainChart.data[index] = {
                        key   : chartData.key,
                        values: chartData.values[range]
                    };
                });
            },
            init        : function ()
            {
                // Run this function once to initialize widget

                /**
                 * Update the range for the first time
                 */
                vm.widget5.changeRange('TW');
            }
        };

        // Widget 6
        vm.widget6 = {
            title       : vm.dashboard.widget6.title,
            mainChart   : {
                config : {
                    refreshDataOnly: true,
                    deepWatchData  : true
                },
                options: {
                    chart: {
                        type        : 'pieChart',
                        color       : ['#f44336', '#9c27b0', '#03a9f4', '#e91e63'],
                        height      : 400,
                        margin      : {
                            top   : 0,
                            right : 0,
                            bottom: 0,
                            left  : 0
                        },
                        donut       : true,
                        clipEdge    : true,
                        cornerRadius: 0,
                        labelType   : 'percent',
                        padAngle    : 0.02,
                        x           : function (d)
                        {
                            return d.label;
                        },
                        y           : function (d)
                        {
                            return d.value;
                        },
                        tooltip     : {
                            gravity: 's',
                            classes: 'gravity-s'
                        }
                    }
                },
                data   : []
            },
            footerLeft  : vm.dashboard.widget6.footerLeft,
            footerRight : vm.dashboard.widget6.footerRight,
            ranges      : vm.dashboard.widget6.ranges,
            currentRange: '',
            changeRange : function (range)
            {
                vm.widget6.currentRange = range;

                /**
                 * Update main chart data by iterating through the
                 * chart dataset and separately adding every single
                 * dataset by hand.
                 *
                 * You MUST NOT swap the entire data object by doing
                 * something similar to this:
                 * vm.widget.mainChart.data = chartData
                 *
                 * It would be easier but it won't work with the
                 * live updating / animated charts due to how d3
                 * works.
                 *
                 * If you don't need animated / live updating charts,
                 * you can simplify these greatly.
                 */
                angular.forEach(vm.dashboard.widget6.mainChart, function (data, index)
                {
                    vm.widget6.mainChart.data[index] = {
                        label: data.label,
                        value: data.values[range]
                    };
                });
            },
            init        : function ()
            {
                // Run this function once to initialize widget

                /**
                 * Update the range for the first time
                 */
                vm.widget6.changeRange('TW');
            }
        };

        // Widget 7
        vm.widget7 = {
            title       : vm.dashboard.widget7.title,
            ranges      : vm.dashboard.widget7.ranges,
            customers   : vm.dashboard.widget7.customers,
            currentRange: 'T'
        };

        // Methods

        //////////

        // Initialize Widget 5
        vm.widget5.init();

        // Initialize Widget 6
        vm.widget6.init();

        //metionds
      vm.selectNewPeriod = selectNewPeriod;

      function selectNewPeriod(id){
        console.log("selecting Pay period");
        console.log(vm.selectedPayPeriod);
        eCommerceService.getPayPeriod(vm.selectedPayPeriod).then(function(res){
          vm.currentPeriod = res.data;
          vm.paymentTotal = 0;
          vm.paymentDue = 0;
          vm.paymentCollected = 0;
          vm.currentPeriod.forEach(function(record){
            if(vm.paymentTotal === 0){
              vm.paymentTotal = record.total;
            }
            else {
              vm.paymentTotal += parseInt(record.total);
            }
            if(record.status[0].id === 12)
            {
              vm.paymentDue += record.total;
            }
            else {
              vm.paymentCollected += record.total;
            }
          })
        });
      }
    }
})();
