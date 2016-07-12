/*
 * app v  (build 20160712_105200_1)
 * Copyright (c) 2016
 * Author: Chad Keibler 
 */

var app = angular.module('photoSaverApp', ['ngMaterial', 'ngRoute', 'base64', 'LoginCtrl', 'ConfigurationCtrl']);
app.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
	
	$routeProvider
	.when('/', {
		templateUrl:'./views/login.html',
		controller: 'LoginCtrl'
	})
	.when('/user-configurations', {
		templateUrl: './views/user-configurations.html',
		controller: 'ConfigurationCtrl',
		controllerAs: 'vm'
	})	
	.otherwise({
		templateUrl:'./views/login.html'
	});
})
.run(['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
	$rootScope.isLoggedIn = false;
	
	$rootScope.logout = function () {
		$http({
			method: 'POST',
			url: '/logout'
		}).then(function (res) {
			//vm.showSimpleToast('Logging out...');
			$rootScope.isLoggedIn = false;
			//vm.redir('/');
			$location.path('/');
		}, function (res) {
			//vm.showSimpleToast('lougout failed... strange...');
		});
	};
}]);
