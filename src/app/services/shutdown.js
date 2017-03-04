(function () {
    'use strict';
    var serviceId = 'shutdown';
    angular.module('fc-ngi').factory(serviceId, ['$q', '$window', 'profile', 'scoring', 'nav', shutdown]);
    
    function shutdown($q, $window, profile, scoring, nav) {        
        
        function shutDownApp(type) {
            var profileObj = profile.getProfile();
            
            //if still scoring, stop it and record the trip;
            if (glob_startDateTime) {
                var trip = scoring.stopScoring();
                profileObj = profile.addTrip(profileObj, trip);
                profile.saveProfile(profileObj);
            }
            
            //stop navigation
            nav.stopNav();
        }
        
        return {
            shutDownApp: shutDownApp
        };
    }
})();