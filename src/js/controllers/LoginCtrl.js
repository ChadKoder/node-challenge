angular.module('sampleApp.controllers', []).
controller('LoginCtrl', function($scope, $http, $mdToast, $window) {
	$scope.title = 'NodeJS Sample Application';
	$scope.username = '';
	$scope.password = '';
		
	var redirectDelay = 1000;
	
	$scope.showSimpleToast = function (msg){
			$mdToast.showSimple(msg);
	};
	
	$scope.redir = function(url){
		setTimeout(function(){
				$window.location = url;
			}, redirectDelay);
	};
	
	$scope.login = function (){
		if (!$scope.username || !$scope.password){
			$scope.showSimpleToast('username and password are required!');
			return;
		}
		
		var encodedAuth = btoa($scope.username + ':' + $scope.password);
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
		
		var req = {
			method: 'GET',
			url: '/validateUser',
			data: { config: $scope.selectedConfig }
		};
		
		$http(req).success(function(){
			$scope.showSimpleToast('Login Successful! redirecting...');
			$scope.redir('/user-configurations');
		}).error(function(res){
			if (res === '401 Unauthorized'){
				$scope.showSimpleToast('Unauthorized user!');
			} else {
				$scope.showSimpleToast('an error has occurred.');
			}
		});
	};
});