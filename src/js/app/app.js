var app = angular.module('photoSaverApp', ['ngMaterial', 'ngRoute', 'LoginCtrl', 'ConfigurationCtrl']);
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