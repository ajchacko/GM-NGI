(function () {
    'use strict';

    var controllerId = 'layout';
    angular.module('fc-ngi').controller(controllerId,
        ['$rootScope', 'common', 'config', 'nav', 'shutdown', layout]);

    function layout($rootScope, common, config, nav, shutdown) {
        var vm = this;
        var events = config.events;
        vm.isBusy = true;
        vm.title = '';
        vm.showNavBar = false;
        vm.closeApp = closeApp;
        
        activate();

        function activate() {
            common.activateController([nav.startNav(), init()], controllerId);
        }
        
        function init() {
            gm.system.setShutdown(shutdown.shutDownApp);
        }
        
        function toggleSpinner(on) {
            vm.isBusy = on;
        }
        
        function closeApp() {
            gm.system.closeApp();
        }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { 
            toggleSpinner(true); 
        }
        );

        $rootScope.$on('$routeChangeSuccess', function (e, c) {
            if (c.settings) {
                vm.title = c.settings.navString;
            }
        });

        $rootScope.$on(events.controllerActivateSuccess,
            function (data) { 
                toggleSpinner(false); 
            }
        );

        $rootScope.$on(events.spinnerToggle,
            function (data) { 
                toggleSpinner(data.show);
            }
        );
    };
})();