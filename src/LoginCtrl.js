angular.module('sampleApp.controllers', []).
controller('LoginCtrl', function($scope, $http, $mdToast, $location) {
	$scope.title = 'Node.js Sample Application';
	$scope.username = 'ChadK';
	$scope.password = 'Tenable';
	$scope.showConfigs = false;
	
	var redirectDelay = 2000;
	
	$scope.showSimpleToast = function (msg){
		$mdToast.show(
				$mdToast.simple()
				.textContent(msg)
				.position('right')
				.hideDelay(redirectDelay)
			);
	};
	
	$scope.getConfigs = function() {
		var url =  '/configs';
		$http({
			method: 'GET',
			url: url
		}).then(function (res) { 
			//alert(JSON.stringify(res.data.configurations));
			//$location.path('/user-configurations/', true);
			window.location.href = '/user-configurations/';
			$scope.showConfigs = true;
			//var configs = res.data[0];
			$scope.configs = res.data[0];
			
		}, function (res) {
			if (res.status === 401){
				$scope.showSimpleToast('Unauthorized user!');
			} else {
				$scope.showSimpleToast('unknown error has occurred.');
			}
		});
	};
	
	$scope.login = function (){
		if (!$scope.username || !$scope.password){
			//alert('username and password are required.');
			return;
		}
		
		//window.location.href = '/attemptLogin/?username=' + $scope.username + '&password=' + $scope.password;
		var url =  '/attemptLogin/?username=' + $scope.username + '&password=' + $scope.password;
		$http({
			method: 'GET',
			url: url
		}).then( function (res) { 
			$scope.showSimpleToast('Login Successful! redirecting...');
		 
			setTimeout(function(){
				//window.location.href = '/config';
			}, redirectDelay);
		}, function (res) {
			if (res.status === 401){
				$scope.showSimpleToast('Unauthorized user!');
			} else {
				$scope.showSimpleToast('unknown error has occurred.');
			}
		});
	}
});