(function () {
    'use strict';
    var spinnerModule = angular.module('fc-spinner', []);

    spinnerModule.directive('fcSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <fc-spinner fc-spinner-radius="40" fc-spinner-lines="7"></fc-spinner>
        var directive = {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                fcSpinnerRadius: '@',
                fcSpinnerLines: '@',
                fcSpinnerLength: '@',
                fcSpinnerWidth: '@',
                fcSpinnerSpeed: '@',
                fcSpinnerCorners: '@',
                fcSpinnerTrail: '@',
                fcSpinnerColor: '@'
            },
            link: function (scope, element, attrs) {
                var options = {
                    radius: attrs.fcSpinnerRadius || 20,
                    lines: attrs.fcSpinnerLines || 7,
                    length: attrs.fcSpinnerLength || 0,
                    width: attrs.fcSpinnerWidth || 15,
                    speed: attrs.fcSpinnerSpeed || 1.7,
                    corners: attrs.fcSpinnerCorners || 1.0,
                    trail: attrs.fcSpinnerTrail || 100,
                    color: attrs.fcSpinnerColor || '#000000'
                };
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }
        };
        return directive;
    }]);
})();