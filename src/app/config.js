(function () {
    'use strict';

    var app = angular.module('fc-ngi');

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle',
    };

    var config = {
        events: events
    };

    app.value('config', config);

    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
    
    app.config(['ngDialogProvider', function (ngDialogProvider) {
            ngDialogProvider.setDefaults({
                className: 'ngdialog-theme-default',
                plain: true,
                showClose: false,
                closeByDocument: true,
                closeByEscape: true,
                appendTo: false
            });
        }]);
})();