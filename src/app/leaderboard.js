(function () {
    'use strict';

    var controllerId = 'leaderboard';
    angular.module('fc-ngi').controller(controllerId, ['$document', 'common', 'profile', 'scoring', leaderboard]);

    function leaderboard($document, common, profile, scoring) {
        var vm = this;
        vm.isBusy = false;

        vm.averageScore = 0;
        vm.scores = [];
        vm.scores.push({
            Name: "ADONIS MAGALI",
            AverageScore: 850,
            Color: "white"
        }, {
            Name: "AJAY CHACKO",
            AverageScore: 650,
            Color: "white"
        }, {
            Name: "JESSE CHOW",
            AverageScore: 790,
            Color: "white"
        }, {
            Name: "SEAN WENDL",
            AverageScore: 550,
            Color: "white"
        }, {
            Name: "DOMINIC TORETTO",
            AverageScore: 310,
            Color: "white"
        }, {
            Name: "MICHAEL SCHUMACHER",
            AverageScore: 999,
            Color: "white"
        });

        activate();

        function activate() {
            //calls data functions directly so it will not trigger spinner
            //because route change spinner is already showing here
            common.activateController([readProfile(), updateScoreList()], controllerId);
        }

        function readProfile() {
            vm.profile = profile.getProfile();

            if (vm.profile.tripHistory.length > 0) {
                vm.averageScore = Math.round(vm.profile.averageScore);
            }
        }

        function updateScoreList() {
            vm.scores.push({
                Name: "CHRIS MCARTHUR",
                AverageScore: vm.averageScore,
                Color: "#e6ca80"
            })

            vm.scores.sort(function (a, b) {
                return (a.AverageScore < b.AverageScore) ? 1 : ((b.AverageScore < a.AverageScore) ? -1 : 0);
            });
        }

    };
})();
