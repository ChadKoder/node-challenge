var app = angular.module('photoSaverApp', ['ngMaterial', 'ngRoute', 'photoSaver.controllers']);
app.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', {
		templateUrl:'src/views/login.html',
		controller: 'LoginCtrl',
		controllerAs: 'vm'
	})
	.when('/user-configurations', {
		templateUrl: 'src/views/user-configurations.html',
		controller: 'ConfigurationCtrl',
		controllerAs: 'vm'
	})	
	.otherwise({
		templateUrl:'src/views/index.html'
	});
});

/*

var app = angular.module('photoSaver', ['ngRoute', 'ngMaterial', 'photoSaver']);

app.config(
		['$routeProvider', '$httpProvider',
			function ($routeProvider, $httpProvider){
				$routeProvider
						.when('/user-configurations', {
							templateUrl: 'src/views/user-configurations.html',
							controller: 'ConfigurationCtrl',
							controllerAs: 'vm'
						})
						.otherwise({
							templateUrl:'src/views/login.html',
							controller: 'LoginCtrl',
							controllerAs: 'vm'
						});
				
			}]);
		
		
		
			var sampleApp = angular.module('sampleApp', ['ngMaterial', 'ngRoute', 'sampleApp.controllers']);
		sampleApp.config(function ($locationProvider) {
			$locationProvider.html5Mode(true);
			

		  function onDeviceReady() {
			if (navigator.connection.type == Connection.NONE) {
			  navigator.notification.alert('An internet connection is required to continue');
			} else {
			alert('oops');
			 // window.location="http://www.";
			}
		  }
		  document.addEventListener("deviceready", onDeviceReady, false);

		});*/