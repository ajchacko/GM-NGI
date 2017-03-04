(function () {
    'use strict';

    var controllerId = 'splash';
    angular.module('fc-ngi').controller(controllerId, ['$document','$location', '$timeout', 'common', splash]);

    function splash($document, $location, $timeout, common) {
        var vm = this;
        vm.isBusy = false;

        activate();

        function activate() {
            //calls data functions directly so it will not trigger spinner
            //because route change spinner is already showing here
            common.activateController([setupTimeout()], controllerId);
        }
        
        function setupTimeout() {
            $timeout(navigate, 2500);
        }
        
        function navigate() {
            if ($location.path() == '/') {
                $location.path('/summary');
            }
        }
    };
})();
