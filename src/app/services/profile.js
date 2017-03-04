(function () {
    'use strict';
    var serviceId = 'profile';
    angular.module('fc-ngi').factory(serviceId, ['$q', '$window', profile]);
    
    function profile($q, $window) {        
        
        function getProfile() {
            var profileObj = {
                    averageScore: 0,
                    averageScoreDuration: 0,
                    tripHistory: []
                };
            
            //blocking read. 
            var profilestring = gm.io.readFile('driverProfile.dat');
            if (profilestring) {
                profileObj = JSON.parse(profilestring);
            }
            
            return profileObj;
        }
        
        function addTrip(profileObj, trip) {
            var totalDuration = trip.duration + profileObj.averageScoreDuration;
            var averageWeight = profileObj.averageScoreDuration / totalDuration;
            var tripWeight = trip.duration / totalDuration;
            
            profileObj.averageScore = profileObj.averageScore * averageWeight + trip.score * tripWeight;
            profileObj.averageScoreDuration = totalDuration;
            profileObj.tripHistory.push(trip);
            
            return profileObj;
        }
        
        function saveProfile(profile) {
            var profilestring = JSON.stringify(profile);
            gm.io.writeFile('driverProfile.dat', profilestring);      
        }
        
        return {
            getProfile: getProfile,
            addTrip: addTrip,
            saveProfile: saveProfile
        };
    }
})();