//using globals. i'm cheating, but I don't have time to figure it out.
var glob_startDateTime = null;
var glob_textAlerts = [];

//variables used for calculating scores
var glob_SeatBeltFastenedStart = null;
var glob_SeatBeltDurationFastened = 0;
var glob_LaneDepartureStart = null;
var glob_LaneDepartureDuration = 0;

var glob_SpeedingDuration = 0;
var glob_SpeedingStart = null;
var glob_average_speed = 0;
var glob_speed_limit = 1000;

var glob_HarshBreakingCount = 0;
var glob_HarshBreakingFlag = 0;


var glob_break_position = 0;
var glob_speed_brk = 0;

var glob_HarshCorneringCount = 0;
var glob_HarshCorneringFlag = 0;

var glob_yaw_rate = 0;
var glob_speed_yaw = 0;

var glob_brakeWarning = 0;
var glob_cornerWarning = 0;
var glob_speedWarning = 0;
var glob_seatBeltWarning = 0;
var glob_noSignalWarning = 0;
var glob_totalWarnings = 0;



(function () {
    'use strict';
    var serviceId = 'scoring';
    angular.module('fc-ngi').factory(serviceId, ['$q', '$window', scoring]);

    function scoring($q, $window) {
        function getCurrentScore() {
            var totalScore = 0;
            this.scoringCriteria.forEach(function (crit) {
                totalScore = totalScore + crit.getScore();
            })
            return totalScore;
        }

        function getMaxScore() {
            var maxScore = 0;
            this.scoringCriteria.forEach(function (crit) {
                maxScore = maxScore + crit.maxScore;
            })
            return maxScore;
        }

        function getTextAlerts() {
            var tempAlerts = glob_textAlerts;
            glob_textAlerts = [];
            return tempAlerts;
        }

        function startScoring() {
            if (!glob_startDateTime) {
                glob_startDateTime = new Date();
                this.scoringCriteria.forEach(function (crit) {
                    crit.start();
                })
            }
        }

        function stopScoring() {
            this.scoringCriteria.forEach(function (crit) {
                crit.stop();
            })
            var finalScore = this.getCurrentScore();
            var finalDuration = new Date() - glob_startDateTime;
            clearGlobals();
            return {
                score: finalScore,
                duration: finalDuration,
                tripDate: new Date().toString()
            };
        }
        
        function clearGlobals() {
            //using globals. i'm cheating, but I don't have time to figure it out.
            glob_startDateTime = null;
            glob_textAlerts = [];

            //variables used for calculating scores
            glob_SeatBeltFastenedStart = null;
            glob_SeatBeltDurationFastened = 0;
            glob_LaneDepartureStart = null;
            glob_LaneDepartureDuration = 0;

            glob_SpeedingDuration = 0;
            glob_SpeedingStart = null;
            glob_average_speed = 0;
            glob_speed_limit = 1000;

            glob_HarshBreakingCount = 0;
            glob_HarshBreakingFlag = 0;

            glob_break_position = 0;
            glob_speed_brk = 0;

            glob_HarshCorneringCount = 0;
            glob_HarshCorneringFlag = 0;

            glob_yaw_rate = 0;
            glob_speed_yaw = 0;

            glob_brakeWarning = 0;
            glob_cornerWarning = 0;
            glob_speedWarning = 0;
            glob_seatBeltWarning = 0;
            glob_noSignalWarning = 0;
            glob_totalWarnings = 0;            
        }

        //for suggestions on how to improve the score
        function getLowMessages() {
            var messages = [];
            this.scoringCriteria.forEach(function (crit) {
                var message = crit.getLowScoreMessage();
                if (message != '') {
                    messages.push({
                        Criteria: crit.description,
                        Message: message
                    });
                }
            })
            return messages;
        }

        //messages of encouragement for scoring high on certain criteria
        function getHighMessages() {
            var messages = [];
            this.scoringCriteria.forEach(function (crit) {
                var message = crit.getHighScoreMessage();
                if (message != '') {
                    messages.push({
                        Criteria: crit.description,
                        Message: message
                    });
                }
            })
            return messages;
        }


        // Play Warnings
        function playWarning(criteria) {
            var severity = 0;
            switch (criteria) {
                case 'harshBraking':
                    severity = ++glob_brakeWarning;
                    break;
                case 'harshCornering':
                    severity = ++glob_cornerWarning;
                    break;
                case 'seatBelt':
                    severity = ++glob_seatBeltWarning;
                    break;
                case 'speeding':
                    severity = ++glob_speedWarning;
                    break;
                case 'noSignal':
                    severity = ++glob_noSignalWarning;
                    break;
                //default: do nothing
            }            
            if (severity > 0) {
                if (severity > 3){
                    severity = 3;
                }
                var handle = gm.media.play('audio/' + criteria + severity + '.mp3', 'mixedAudio',status);
            }
        }
        
        function status(status, mediaObject) {
            console.log(status);
            console.log(mediaObject);
        }

        return {
            getCurrentScore: getCurrentScore,
            getMaxScore: getMaxScore,
            getLowMessages: getLowMessages,
            getHighMessages: getHighMessages,
            getTextAlerts: getTextAlerts,
            startScoring: startScoring,
            stopScoring: stopScoring,
            scoringCriteria: [
                {
                    description: 'Seat Belt',
                    initcallback: function (data) {
                        var status = parseInt(data.driver_seatbelt_fastened);
                        if (status == 1) {
                            glob_SeatBeltFastenedStart = glob_startDateTime;
                        } else {
                            playWarning('seatBelt');
                            glob_textAlerts.push({
                                        text: 'Seat belt unfastened!',
                                        width: 240,
                                        type: 'bad'
                                    });
                        }
                    },
                    watchcallback: function (data) {
                        var status = parseInt(data.driver_seatbelt_fastened);
                        switch (status) {
                            case -1:
                            case 0:
                                if (glob_SeatBeltFastenedStart) {
                                    playWarning('seatBelt');                                
                                    glob_textAlerts.push({
                                        text: 'Seat belt unfastened!',
                                        width: 240,
                                        type: 'bad'
                                    });
                                    glob_SeatBeltDurationFastened = glob_SeatBeltDurationFastened + (new Date() - glob_SeatBeltFastenedStart);
                                    glob_SeatBeltFastenedStart = null;
                                }
                                break;
                            case 1:
                                if (!glob_SeatBeltFastenedStart) {
                                    glob_textAlerts.push({
                                        text: 'Seat belt buckled',
                                        width: 200,
                                        type: 'good'
                                    });
                                    glob_SeatBeltFastenedStart = new Date();
                                }
                                break;
                        }
                    },
                    getScore: function () {
                        var interimFastened = 0;
                        if (glob_SeatBeltFastenedStart != null) {
                            interimFastened = new Date() - glob_SeatBeltFastenedStart;
                        }
                        return (glob_SeatBeltDurationFastened + interimFastened) / (new Date() - glob_startDateTime) * 500;

                    },
                    maxScore: 500,
                    getLowScoreMessage: function () {
                        if (this.getScore() < 450) {
                            return 'Fasten your seat belt and stay buckled in';
                        } else {
                            return '';
                        }
                    },
                    getHighScoreMessage: function () {
                        //no high score message for this criteria. buckling in should be a given
                        return '';
                    },
                    watchHandle: {},
                    start: function () {
                        var signalFilter = ['driver_seatbelt_fastened'];

                        gm.info.getVehicleData(this.initcallback, signalFilter);

                        this.watchHandle = gm.info.watchVehicleData(this.watchcallback, signalFilter);
                    },
                    stop: function () {
                        gm.info.clearVehicleData(this.watchHandle);
                    }
                },

                {
                    description: 'Harsh Braking',
                    initcallback: function (data) {
                        var status = parseInt(data.brake_position);
                        var speed = parseInt(data.average_speed);

                        if (speed || speed == 0) {
                            glob_speed_brk = speed;
                        }
                        if (status || status == 0) {
                            glob_break_position = status;
                        }

                        if (glob_break_position > 30 && glob_speed_brk > 30) {
                            glob_HarshBreakingCount = glob_HarshBreakingCount + 1;
                        }
                    },
                    watchcallback: function (data) {
                        var status = parseInt(data.brake_position);
                        var speed = parseInt(data.average_speed);
                        console.log(speed);

                        if (speed || speed == 0) {
                            glob_speed_brk = speed;
                        }
                        if (status || status == 0) {
                            glob_break_position = status;
                        }

                        if (glob_speed_brk < 30 && glob_speed_brk > 15) {
                            if (glob_speed_brk + glob_break_position > 50) {
                                if (glob_HarshBreakingFlag == 0) {
									
									glob_textAlerts.push({
                                            text: 'Harsh breaking detected!',
                                            width: 280,
                                            type: 'bad'
                                        });

                                        playWarning('harshBraking');
   
                                    glob_HarshBreakingFlag = 1;
                                    glob_HarshBreakingCount = glob_HarshBreakingCount + 1
                                }
                            }

                            if (glob_speed_brk + glob_break_position <= 40) {
                                if (glob_HarshBreakingFlag == 1) {
                                    glob_HarshBreakingFlag = 0;
                                }
                            }
                        }

                        if (glob_speed_brk >= 30) {
                            if (glob_HarshBreakingFlag == 0 && glob_break_position > 20) {
                                
                               
                                    playWarning('harshBraking');
                                    glob_textAlerts.push({
                                        text: 'Harsh breaking detected!',
                                        width: 280,
                                        type: 'bad'
                                    });
                               
                                glob_HarshBreakingFlag = 1;
                                glob_HarshBreakingCount = glob_HarshBreakingCount + 1
                            }


                            if (glob_HarshBreakingFlag == 1 && glob_break_position < 20) {
                                glob_HarshBreakingFlag = 0;

                            }
                        }
                    },
                    getScore: function () {
                        //                        var interimFastened = 0;
                        //                        if (glob_SeatBeltFastenedStart != null) {
                        //                            interimFastened = new Date() - glob_SeatBeltFastenedStart;
                        //                        }
                        //return (glob_HarshBreakingCount) * -1;
                        
                        var score = ((glob_HarshBreakingCount * 400000) / (new Date() - glob_startDateTime) * -50);
                        
                        if (score < -100) {
                            score = -200;
                        }
                        return score;

                    },
                    maxScore: 0,
                    getLowScoreMessage: function () {
                        if (this.getScore() < -100) {
                            return 'Please leave enough safe distance between you and the vehicle in front of you to avoid the risk of traffic accidents';
                        } else {
                            return '';
                        }
                    },
                    getHighScoreMessage: function () {
                        //no high score message for this criteria. buckling in should be a given
                        return '';
                    },
                    watchHandle: {},
                    start: function () {
                        var signalFilter = ['brake_position', 'average_speed'];

                        gm.info.getVehicleData(this.initcallback, signalFilter);

                        this.watchHandle = gm.info.watchVehicleData(this.watchcallback, signalFilter);
                    },
                    stop: function () {
                        gm.info.clearVehicleData(this.watchHandle);
                    }
                },

                { // Harsh Cornering
                    description: 'Harsh Cornering',
                    initcallback: function (data) {

                        var yaw = parseInt(data.yaw_rate);

                        if (yaw < 0) {
                            yaw = yaw * -1;
                        }
                        var speed = parseInt(data.average_speed);

                        if (speed || speed == 0) {
                            glob_speed_yaw = speed;
                        }
                        if (yaw || yaw == 0) {
                            glob_yaw_rate = yaw;
                        }

                        if (glob_speed_yaw > 10 && glob_yaw_rate > 40) {
                            glob_HarshCorneringCount = glob_HarshCorneringCount + 1;
                        }


                    },
                    watchcallback: function (data) {
                        var yaw = parseInt(data.yaw_rate);
                        var speed = parseInt(data.average_speed);

                        if (yaw < 0) {
                            yaw = yaw * -1;
                        }

                        if (speed || speed == 0) {
                            glob_speed_yaw = speed;
                        }
                        if (yaw || yaw == 0) {
                            glob_yaw_rate = yaw;
                        }

                        if (glob_speed_yaw <= 30) {
                            if ((glob_speed_yaw + glob_yaw_rate) > 40) {
                                if (glob_HarshCorneringFlag == 0) {
                                    playWarning('harshCornering');
                                    glob_textAlerts.push({
                                        text: 'Harsh cornering detected!',
                                        width: 280,
                                        type: 'bad'
                                    });
                                    glob_HarshCorneringFlag = 1;
                                    glob_HarshCorneringCount = glob_HarshCorneringCount + 1;
									playWarning('corneringBreak_warning.mp3');
									updateTotalWarnings('glob_cornerWarning');
                                }
                            }
                            if ((glob_speed_yaw + glob_yaw_rate) <= 40) {
                                if (glob_HarshCorneringFlag == 1) {
                                    glob_HarshCorneringFlag = 0;
                                }
                            }
						}

                        if (glob_speed_yaw > 30) {
                            if (glob_yaw_rate > 20) {
                                if (glob_HarshCorneringFlag == 0) {
                                    playWarning('harshCornering');
                                    glob_textAlerts.push({
                                        text: 'Harsh cornering detected!',
                                        width: 280,
                                        type: 'bad'
                                    });
                                    glob_HarshCorneringFlag = 1;
                                    glob_HarshCorneringCount = glob_HarshCorneringCount + 1;
									playWarning('corneringBreak_warning.mp3');
									updateTotalWarnings('glob_cornerWarning');
                                }
                            }

                            if (glob_yaw_rate <= 20) {
                                if (glob_HarshCorneringFlag == 1) {
                                    glob_HarshCorneringFlag = 0;
                                }
                            }
                        }
                    },
                    getScore: function () {
                        var interimFastened = 0;
                        if (glob_SeatBeltFastenedStart != null) {
                            interimFastened = new Date() - glob_SeatBeltFastenedStart;
                        }

                        return ((glob_HarshCorneringCount * 420000) / (new Date() - glob_startDateTime) * -1.75);

                    },
                    maxScore: 0,
                    getLowScoreMessage: function () {
                        if (this.getScore() < -100) {
                            return 'Too much Harsh Cornering';
                        } else {
                            return '';
                        }
                    },
                    getHighScoreMessage: function () {
                        //no high score message for this criteria. buckling in should be a given
                        return '';
                    },
                    watchHandle: {},
                    start: function () {
                        var signalFilter = ['yaw_rate', 'average_speed'];

                        gm.info.getVehicleData(this.initcallback, signalFilter);

                        this.watchHandle = gm.info.watchVehicleData(this.watchcallback, signalFilter);
                    },
                    stop: function () {
                        gm.info.clearVehicleData(this.watchHandle);
                    }
                },

                {
                    description: 'Speeding',
                    initcallback: function (data) {
                        var speed = parseInt(data.average_speed);
                        var limit = parseInt(data.speed_limit);
                        if (speed || speed == 0) {
                            glob_average_speed = speed;
                        }
                        if (limit || limit == 0) {
                            glob_speed_limit = limit;
                        }

                        if (glob_average_speed > glob_speed_limit) { // if speeding then assign Glob start time to speeding start time
                            glob_SpeedingStart = glob_startDateTime;
                        }

                    },
                    watchcallback: function (data) {
                        var speed = parseInt(data.average_speed);
                        var limit = parseInt(data.speed_limit);
                        if (speed || speed == 0) {
                            glob_average_speed = speed;
                        }
                        if (limit || limit == 0) {
                            glob_speed_limit = limit;
                        }

                        if (glob_average_speed <= glob_speed_limit) {
                            if (glob_SpeedingStart) {
                                glob_SpeedingDuration = glob_SpeedingDuration + (new Date() - glob_SpeedingStart);
                                glob_SpeedingStart = null;
                                glob_textAlerts.push({
                                    text: 'Stopped speeding',
                                    width: 200,
                                    type: 'good'
                                });
                            }
                        }
                        if (glob_average_speed > glob_speed_limit) {
                            if (!glob_SpeedingStart) {
                                glob_SpeedingStart = new Date();
                                playWarning('speeding');
                                glob_textAlerts.push({
                                    text: 'Speeding detected!',
                                    width: 220,
                                    type: 'bad'
                                });
                            }
                        }

                    },
                    getScore: function () {
                        var interimSpeeding = 0;
                        if (glob_SpeedingStart != null) {
                            interimSpeeding = new Date() - glob_SpeedingStart;
                        }
                        return ((glob_SpeedingDuration + interimSpeeding) / (new Date() - glob_startDateTime) * -400) + 400;

                    },
                    maxScore: 400,
                    getLowScoreMessage: function () {
                        if (this.getScore() < 300) {
                            return 'Keep under the Speed Limit';
                        } else {
                            return '';
                        }
                    },
                    getHighScoreMessage: function () {
                        //no high score message for this criteria. buckling in should be a given
                        return '';
                    },
                    watchHandle: {},
                    start: function () {

                        var signalFilter = ['average_speed', 'speed_limit'];

                        gm.info.getVehicleData(this.initcallback, signalFilter);

                        this.watchHandle = gm.info.watchVehicleData(this.watchcallback, signalFilter);
                    },
                    stop: function () {
                        gm.info.clearVehicleData(this.watchHandle);
                    }
                },


                {
                    description: 'Lane Departure',
                    initcallback: function (data) {
                        var status = data.lane_departure_ind1;
                        console.log(data);
                        if (status == '$0') {
                            glob_LaneDepartureStart = glob_startDateTime;
                        }
                    },
                    watchcallback: function (data) {
                        console.log(data);
                        var status = data.lane_departure_ind1;
                        switch (status) {
                            case '$1':
                                if (glob_LaneDepartureStart) {
                                    glob_LaneDepartureDuration = glob_LaneDepartureDuration + (new Date() - glob_LaneDepartureStart);
                                    glob_LaneDepartureStart = null;
                                    playWarning('noSignal');
                                    glob_textAlerts.push({
                                        text: 'Lane departure detected!',
                                        width: 270,
                                        type: 'bad'
                                    });
                                }
                                break;
                            default:
                                if (!glob_LaneDepartureStart) {
                                    glob_LaneDepartureStart = new Date();
                                    glob_textAlerts.push({
                                        text: 'Returned to lane',
                                        width: 200,
                                        type: 'good'
                                    });
                                }
                                break;
                        }
                    },
                    getScore: function () {
                        var temp = 0;
                        if (glob_LaneDepartureStart != null) {
                            temp = new Date() - glob_LaneDepartureStart;
                        }
                        return (glob_LaneDepartureDuration + temp) / (new Date() - glob_startDateTime) * 100;

                    },
                    maxScore: 100,
                    getLowScoreMessage: function () {
                        if (this.getScore() < 90) {
                            return 'Please use your signals while changing lanes';
                        } else {
                            return '';
                        }
                    },
                    getHighScoreMessage: function () {
                        //no high score message for this criteria. buckling in should be a given
                        return '';
                    },
                    watchHandle: {},
                    start: function () {

                        var signalFilter = ['lane_departure_ind1'];

                        gm.info.getVehicleData(this.initcallback, signalFilter);

                        this.watchHandle = gm.info.watchVehicleData(this.watchcallback, signalFilter);
                    },
                    stop: function () {
                        gm.info.clearVehicleData(this.watchHandle);
                    }
                }

            ]
        };
    }
})();