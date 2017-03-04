(function () { 
    'use strict';
    
    var controllerId = 'navbar';
    angular.module('fc-ngi').controller(controllerId, ['$rootScope', '$route', '$window', 'routes', navbar]);

    function navbar($rootScope, $route, $window, routes) {
        var vm = this;

        vm.isCurrent = isCurrent;
        vm.routes = [];
        
        activate();

        function activate() {
            vm.routes = routes.filter(function (route) {
                return route.config.settings.ordinal > -1;
            });
        }
        
        function isCurrent(route) {
            if ($route.current) {
                return $route.current.title == route.config.title;
            } else {
                return false;
            }
        }        
    };
})();
