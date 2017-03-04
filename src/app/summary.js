(function () {
    'use strict';

    var controllerId = 'summary';
    angular.module('fc-ngi').controller(controllerId, ['$document', 'common', 'profile', 'scoring', summary]);

    function summary($document, common, profile, scoring) {
        var vm = this;
        vm.isBusy = false;
        vm.vin = 'asd';
        
        vm.hasCompletedTrip = false;
        
        vm.feedback = "YOU SHOULDN'T BE DRIVING";
        vm.feedbackColor = "#ff7a7a";

        vm.maxScore = scoring.getMaxScore();

        activate();

        function activate() {
            //calls data functions directly so it will not trigger spinner
            //because route change spinner is already showing here
            common.activateController([readProfile(), setupChart()], controllerId);
        }

        function readProfile() {
            //blocking read. graphs need this before drawing.
            vm.profile = profile.getProfile();

            if (glob_startDateTime) {
                vm.trip = scoring.stopScoring();
                vm.profile = profile.addTrip(vm.profile, vm.trip);
                profile.saveProfile(vm.profile);
                vm.hasCompletedTrip = true;
            } else {
                if (vm.profile.tripHistory.length > 0) {
                    vm.trip = vm.profile.tripHistory[vm.profile.tripHistory.length - 1];
                }
            }

            //TODO: use profile to fill in charts/graphs
        }

        function formatDate(date) {
            var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];

            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            return day + ' ' + monthNames[monthIndex] + ' ' + year;
        }

        function setupChart() {

            if (vm.trip) {
                vm.lastTripScore = vm.trip.score;
                vm.averageScore = vm.profile.averageScore;

                var scores = [];
                var dates = [];
                var colors = [];

                for (var index = vm.profile.tripHistory.length - 10; index < vm.profile.tripHistory.length; ++index) {
                    if (index >= 0) {
                        scores.push(Math.round(vm.profile.tripHistory[index].score));
                        var date = vm.profile.tripHistory[index].tripDate;
                        if (index == vm.profile.tripHistory.length - 1 && vm.hasCompletedTrip == true) {
                            dates.push("LAST TRIP");
                        } else {
                            dates.push(date.substring(0, 10));
                        }
                        if (vm.profile.tripHistory[index].score <= vm.maxScore / 4) {
                            colors.push("#ff7a7a");
                        }
                        if (vm.profile.tripHistory[index].score > vm.maxScore / 4 && vm.profile.tripHistory[index].score <= vm.maxScore / 2) {
                            colors.push("#e6ca80");
                        }
                        if (vm.profile.tripHistory[index].score > vm.maxScore / 2 && vm.profile.tripHistory[index].score <= (vm.maxScore * 3) / 4) {
                            colors.push("#82f5ff");
                        }
                        if (vm.profile.tripHistory[index].score > (vm.maxScore * 3) / 4) {
                            colors.push("#b8e986");
                        }
                    }
                }

                vm.barOptions = {
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: true,
                                zeroLineColor: "#535353"
                            },
                            ticks: {
                                fontColor: "#AAA"
                            }
                    }],
                        yAxes: [{
                            gridLines: {
                                display: true,
                                zeroLineColor: "#535353"
                            },
                            ticks: {
                                min: 0,
                                fontColor: "#AAA"
                            }
                    }]
                    }
                };

                vm.barLabels = dates;
                vm.barData = scores;
                vm.barBorderWidth = 1;
                vm.barColors = colors;

                vm.starValue = 0;
                if (vm.lastTripScore > vm.maxScore * .1) {
                    vm.starValue = 0.5;
                    vm.feedback = "REALLY?";
                    vm.feedbackColor = "#ff7a7a";
                }
                if (vm.lastTripScore > vm.maxScore * .2) {
                    vm.starValue = 1;
                    vm.feedback = "REALLY?";
                    vm.feedbackColor = "#ff7a7a";
                }
                if (vm.lastTripScore > vm.maxScore * .3) {
                    vm.starValue = 1.5;
                    vm.feedback = "REALLY?";
                    vm.feedbackColor = "#ff7a7a";
                }
                if (vm.lastTripScore > vm.maxScore * .4) {
                    vm.starValue = 2;
                    vm.feedback = "YOU CAN DO BETTER!!";
                    vm.feedbackColor = "#e6ca80";
                }
                if (vm.lastTripScore > vm.maxScore * .5) {
                    vm.starValue = 2.5
                    vm.feedback = "YOU CAN DO BETTER!!";
                    vm.feedbackColor = "#82f5ff";
                }
                if (vm.lastTripScore > vm.maxScore * .6) {
                    vm.starValue = 3;
                    vm.feedback = "GOOD JOB!!";
                    vm.feedbackColor = "#82f5ff";
                }
                if (vm.lastTripScore > vm.maxScore * .7) {
                    vm.starValue = 3.5;
                    vm.feedback = "GOOD JOB!!";
                    vm.feedbackColor = "#b8e986";
                }
                if (vm.lastTripScore > vm.maxScore * .8) {
                    vm.starValue = 4;
                    vm.feedback = "GREAT JOB!!";
                    vm.feedbackColor = "#b8e986";
                }
                if (vm.lastTripScore > vm.maxScore * .9) {
                    vm.starValue = 4.5;
                    vm.feedback = "GREAT JOB!!";
                    vm.feedbackColor = "#b8e986";
                }
                if (vm.lastTripScore == vm.maxScore) {
                    vm.starValue = 5;
                    vm.feedback = "PERFECT SCORE!!";
                    vm.feedbackColor = "#b8e986";
                }
            }
        }
    };
})();
