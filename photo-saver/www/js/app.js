/*
 * app v  (build 20160706_151256_1)
 * Copyright (c) 2016
 * Author: Chad Keibler 
 */

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