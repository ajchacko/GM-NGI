(function () {
    'use strict';

    var controllerId = 'rest';
    angular.module('fc-ngi').controller(controllerId, ['$document', '$interval', 'common', 'scoring', rest]);

    function rest($document, $interval, common, scoring) {
        var vm = this;

        vm.score = 0;
        vm.subscore1 = vm.subscore2 = vm.subscore3 = vm.subscore4 = 0;
        vm.lowmessages = [];
        vm.highmessages = [];

        var scoreInterval = null;

        activate();

        function activate() {
            //calls data functions directly so it will not trigger spinner
            //because route change spinner is already showing here
            common.activateController([getSubScores()], controllerId);
        }

        function getSubScores() {
            updateSubScores();
            scoreInterval = $interval(updateSubScores, 100);
        }

        function updateSubScores() {
            if (!glob_startDateTime) {
                $interval.cancel(scoreInterval);
            } else {
                
                vm.subscoredescription = 'Seat Belt';
                vm.subCriteria = scoring.scoringCriteria.filter(function (crit) {
                    return crit.description == vm.subscoredescription;
                })[0];
                vm.maxSubScore1 = vm.subCriteria.maxScore;
                vm.subscore1 = vm.subCriteria.getScore();
                if (vm.subscore1 < 0)
                    vm.subscore1 = 0;

                vm.subscoredescription = 'Harsh Braking';
                vm.subCriteria = scoring.scoringCriteria.filter(function (crit) {
                    return crit.description == vm.subscoredescription;
                })[0];
                vm.maxSubScore2 = vm.subCriteria.maxScore;
                vm.subscore2 = vm.subCriteria.getScore();
                if (vm.subscore2 < 0)
                    vm.subscore2 = 0;

                vm.subscoredescription = 'Speeding';
                vm.subCriteria = scoring.scoringCriteria.filter(function (crit) {
                    return crit.description == vm.subscoredescription;
                })[0];
                vm.maxSubScore3 = vm.subCriteria.maxScore;
                vm.subscore3 = vm.subCriteria.getScore();
                if (vm.subscore3 < 0)
                    vm.subscore3 = 0;

                vm.subscoredescription = 'Lane Departure';
                vm.subCriteria = scoring.scoringCriteria.filter(function (crit) {
                    return crit.description == vm.subscoredescription;
                })[0];
                vm.maxSubScore4 = vm.subCriteria.maxScore;
                vm.subscore4 = vm.subCriteria.getScore();
                if (vm.subscore4 < 0)
                    vm.subscore4 = 0;

                vm.maxScore = scoring.getMaxScore();
                vm.score = scoring.getCurrentScore();
                if (vm.score < 0)
                    vm.score = 0;
                
                vm.lowmessages = scoring.getLowMessages();
                vm.highmessages = scoring.getHighMessages(); 
            }
        };
    }
})();
