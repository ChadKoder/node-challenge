angular.module('sampleApp.controllers', []).
controller('LoginCtrl', function($scope, $http, $mdToast, $location) {
	$scope.title = 'Node.js Sample Application';
	$scope.username = 'ChadK';
	$scope.password = 'Tenable';
		
	var redirectDelay = 1000;
	
	$scope.showSimpleToast = function (msg){
		/*$mdToast.simple()
			.textContent(msg)
			.position('right')
			.hideDelay(redirectDelay)*/
			$mdToast.showSimple(msg);
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
			setTimeout(function(){
				window.location.href = '/user-configurations';
			}, redirectDelay);
		}).error(function(res){
			if (res === '401 Unauthorized'){
				$scope.showSimpleToast('Unauthorized user!');
			} else {
				$scope.showSimpleToast('an error has occurred.');
			}
		});
	}
});