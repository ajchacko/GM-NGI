(function () {
    'use strict';

    var ngiapp = angular.module('fc-ngi', [
        // Angular modules 
        //'ngAnimate',           // animations
        'ngRoute',               // routing

        // Custom modules 
        'common',                // common functions
        'fc-spinner',

        // 3rd Party Modules
        'chart.js',    
        'angular-dialgauge',
        'ngDialog',
        'ngRateIt'
    ]);

    ngiapp.run(['$route', function ($route) {
        // Include $route to kick start the router.
    }]);
})();