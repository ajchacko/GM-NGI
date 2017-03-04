(function () {
    'use strict';
    var serviceId = 'nav';
    angular.module('fc-ngi').factory(serviceId, ['$rootScope', '$location', nav]);
    
    function nav($rootScope, $location) {
        var navSpeedWatchHandle = null;
        var navGearWatchHandle = null;
        
        function startNav() {
            speedChangeDetected(gm.system.getSpeed());
            
            navSpeedWatchHandle = gm.system.watchSpeed(speedChangeDetected);
        }
        
        function speedChangeDetected(speed){
            switch (speed){
                case 2:
                    $location.path('/motion');
                    navGearWatchHandle = gm.info.watchVehicleData(gearChangeDetected, ['gear']);
                    $rootScope.$applyAsync();
                    break;
                default:
                    if ($location.path() == '/motion') {
                        $location.path('/rest');
                        $rootScope.$applyAsync();
                    }
                    break;
            }
        }
        
        function gearChangeDetected(data) {
            //if scoring has started and car has gone to park
            if (glob_startDateTime && data.gear == '0x0F'){  
                gm.info.clearVehicleData(navGearWatchHandle);
                navGearWatchHandle = null;
                $location.path('/summary');
                $rootScope.$applyAsync();
            }
        }

        function stopNav() {
            if (navSpeedWatchHandle) {
                gm.system.clearSpeed(navSpeedWatchHandle);
                navSpeedWatchHandle = null;
            }
            if (navGearWatchHandle) {
                gm.info.clearVehicleData(navGearWatchHandle);
                navGearWatchHandle = null;
            }
        }        
        
        return {
            startNav: startNav,
            stopNav: stopNav
        };
    }
})();