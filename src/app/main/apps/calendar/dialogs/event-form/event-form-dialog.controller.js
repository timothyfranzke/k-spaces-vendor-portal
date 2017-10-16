(function ()
{
    'use strict';

    angular.module('app.calendar')
        .controller('EventFormDialogController', EventFormDialogController);

    /** @ngInject */
    function EventFormDialogController($mdDialog, dialogData)
    {
        var vm = this;

        // Data
        vm.dialogData = dialogData;
        vm.notifications = ['15 minutes before', '30 minutes before', '1 hour before'];

        // Methods
        vm.saveEvent = saveEvent;
        vm.removeEvent = removeEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            // Figure out the title
            switch ( vm.dialogData.type )
            {
                case 'add' :
                    vm.dialogTitle = 'Add Event';
                    break;

                case 'edit' :
                    vm.dialogTitle = 'Edit Event';
                    break;

                default:
                    break;
            }

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                // Clone the calendarEvent object before doing anything
                // to make sure we are not going to brake FullCalendar
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.calendarEvent.start) )
                {
                    vm.calendarEvent.start = vm.calendarEvent.start.toDate();
                }

                if ( moment.isMoment(vm.calendarEvent.end) )
                {
                    vm.calendarEvent.end = vm.calendarEvent.end.toDate();
                }
            }
            // Add
            else
            {
                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.dialogData.start) )
                {
                    vm.dialogData.start = vm.dialogData.start.toDate();
                }

                if ( moment.isMoment(vm.dialogData.end) )
                {
                    vm.dialogData.end = vm.dialogData.end.toDate();
                }

                vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    notifications: []
                };
            }
        }

        /**
         * Save the event
         */
        function saveEvent()
        {
            // Convert the javascript date objects back to the moment.js dates
            if(vm.calendarEvent.startTime !== undefined)
            {
              var day = vm.calendarEvent.start.getDate();
              var month = vm.calendarEvent.start.getMonth();
              var year = vm.calendarEvent.start.getFullYear();
              var hour = vm.calendarEvent.startTime.getHours();
              var minute = vm.calendarEvent.startTime.getMinutes();
              vm.calendarEvent.start = new Date(year, month, day, hour, minute);
              //console.log(day + " " + month + " " + year + " " + hour + " " + minute);
            }
          if(vm.calendarEvent.endTime !== undefined)
          {
            var day = vm.calendarEvent.end.getDate();
            var month = vm.calendarEvent.end.getMonth();
            var year = vm.calendarEvent.end.getFullYear();
            var hour = vm.calendarEvent.endTime.getHours();
            var minute = vm.calendarEvent.endTime.getMinutes();
            vm.calendarEvent.end = new Date(year, month, day, hour, minute);
            //console.log(day + " " + month + " " + year + " " + hour + " " + minute);
          }
            var dates = {
                start: vm.calendarEvent.start,
                end  : vm.calendarEvent.end
            };

            var response = {
                type         : vm.dialogData.type,
                calendarEvent: angular.extend({}, vm.calendarEvent, dates)
            };

            $mdDialog.hide(response);
        }

        /**
         * Remove the event
         */
        function removeEvent()
        {
            var response = {
                type         : 'remove',
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }
    }
})();
