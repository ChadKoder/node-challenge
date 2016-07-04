angular.module('app', ['ngMaterial'])
	.config(
		['$routeProvider', '$httpProvider',
			function ($routeProvider, $httpProvider){
				$routeProvider
					.when('login', {
						templateUrl: 'src/views/login.html',
						controller: 'LoginCtrl',
						controllerAs: 'vm'
						})
						.otherwise({
							templateUrl: 'src/views/user-configurations',
							controller: 'ConfigurationCtrl',
							controllerAs: 'vm'
						});
				
			}]);
		