(function () {
    'use strict';

    var controllerId = 'motion';
    angular.module('fc-ngi').controller(controllerId, ['$scope','$document', '$timeout', '$interval', 'common', 'scoring', 'ngDialog', motion]);

    function motion($scope, $document, $timeout, $interval, common, scoring, ngDialog) {
        var vm = this;
        vm.score = 0;    
        vm.lowmessages = [];
        vm.highmessages = [];         
        vm.gaugeColor = "#ffffff";

        var scoreInterval = null;                
        activate();

        function activate() {
            //calls data functions directly so it will not trigger spinner
            //because route change spinner is already showing here
            common.activateController([startScoring()], controllerId);
        }

        function startScoring() {
            vm.maxScore = scoring.getMaxScore();            
            
            scoring.startScoring();
            updateScore();

            scoreInterval = $interval(updateScore, 100);
        }
        
        function updateScore() {
            if (!glob_startDateTime) {
                $interval.cancel(scoreInterval);
            } else {
                vm.score = Math.round(scoring.getCurrentScore());
                if (vm.score < 0)
                    vm.score = 0;
                vm.lowmessages = scoring.getLowMessages();
                vm.highmessages = scoring.getHighMessages(); 
                
                var alerts = scoring.getTextAlerts();
                alerts.forEach(function(alert) {
                    var randomId = Math.floor(Math.random() * 9999999).toString();
                    var new_dialog = ngDialog.open({ id: randomId, template: '<h3>'+alert.text+'</h3>', overlay: false, width: alert.width, className: 'alert'+(randomId % 10) + ' ' + alert.type });
                    
                    $timeout(function() { 
                        ngDialog.close(new_dialog.id);
                    }, 2000);                   
                });
                
                if (vm.score <= vm.maxScore/4)
                {
                    vm.gaugeColor = "#ff7a7a";
                }
                if (vm.score > vm.maxScore/4 && vm.score <= vm.maxScore/2)
                {
                    vm.gaugeColor = "#e6ca80";
                }
                if (vm.score > vm.maxScore/2 && vm.score <= (vm.maxScore*3)/4 )
                {
                    vm.gaugeColor = "#82f5ff";
                }
                if (vm.score > (vm.maxScore*3)/4)
                {
                    vm.gaugeColor = "#b8e986";
                }
            }               
        }
    };
})();