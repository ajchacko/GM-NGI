(function () {
	'use strict';

	var app = angular.module('fc-ngi');

	// Collect the routes
	app.constant('routes', getRoutes());

	// Configure the routes and route resolvers
	app.config(['$routeProvider', 'routes', routeConfigurator]);
	function routeConfigurator($routeProvider, routes) {

		routes.forEach(function (r) {
			$routeProvider.when(r.url, r.config);
		});
		$routeProvider.otherwise({ redirectTo: '/' });
	}

	// Define the routes 
	function getRoutes() {
		return [
            {
            	url: '/',
            	config: {
            	    templateUrl: 'app/splash.html',
            	    title: 'splash',
            	    controller: 'splash',
            	    controllerAs: 'vm',
            		settings: {
            			ordinal: -1,
            			navString: 'Splash',
            		}
            	}
            },
            {
            	url: '/motion',
            	config: {
            	    templateUrl: 'app/motion.html',
            	    title: 'motion',
            	    controller: 'motion',
            	    controllerAs: 'vm',
            		settings: {
            			ordinal: 2,
            			navString: 'Motion',
            			navImage: 'images/home.png',
                        selectedImage: 'images/home_selected.png'
            		}
            	}
            },
            {
            	url: '/summary',
            	config: {
            	    templateUrl: 'app/summary.html',
            	    title: 'summary',
            	    controller: 'summary',
            	    controllerAs: 'vm',
            		settings: {
            			ordinal: 1,
            			navString: 'Summary',
            			navImage: 'images/summary.png',
                        selectedImage: 'images/summary_selected.png'
            		}
            	}
            },
            {
            	url: '/rest',
            	config: {
            	    templateUrl: 'app/rest.html',
            	    title: 'rest',
            	    controller: 'rest',
            	    controllerAs: 'vm',
            		settings: {
            			ordinal: 3,
            			navString: 'Rest',
            			navImage: 'images/home.png',
                        selectedImage: 'images/home_selected.png'
            		}
            	}
            },
            {
            	url: '/leaderboard',
            	config: {
            	    templateUrl: 'app/leaderboard.html',
            	    title: 'leaderboard',
            	    controller: 'leaderboard',
            	    controllerAs: 'vm',
            		settings: {
            			ordinal: 4,
            			navString: 'Leaderboard',
            			navImage: 'images/leaderboard.png',
                        selectedImage: 'images/home_selected.png'
            		}
            	}
            }     
		];
	}
})();