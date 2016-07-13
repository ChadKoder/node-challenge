
var app = angular.module('photoSaverApp', ['ngMaterial', 'ngRoute', 'base64', 'MainCtrl']);
app.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
	
	$routeProvider
	.when('/', {
		templateUrl:'./views/main.html',
		controller: 'MainCtrl',
		controllerAs: 'vm'
	})
	.otherwise({
		templateUrl:'./views/main.html',
		controller: 'MainCtrl',
		controllerAs: 'vm'
	});
});
