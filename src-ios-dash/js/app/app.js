
var app = angular.module('photoSaverApp', ['ngMaterial', 'ngRoute', 'base64', 'LoginCtrl']);
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
