angular.module('sampleApp.controllers', []).
controller('LoginCtrl', function($scope, $http, $mdToast, $location) {
	$scope.title = 'Node.js Sample Application';
	$scope.username = 'ChadK';
	$scope.password = 'Tenable';
		
	var redirectDelay = 1000;
	
	$scope.showSimpleToast = function (msg){
		$mdToast.show(
				$mdToast.simple()
				.textContent(msg)
				.position('right')
				.hideDelay(redirectDelay)
			);
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
				window.location.href = '/user-configurations';
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