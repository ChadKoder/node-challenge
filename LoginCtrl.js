angular.module('sampleApp.controllers', []).
controller('LoginCtrl', function($scope,  $location, $http) {
	$scope.title = 'Node.js Sample Application';
	$scope.username = 'ChadK';
	$scope.password = 'Tenable';
	
	$scope.login = function (){
		if (!$scope.username || !$scope.password){
			alert('username and password are required.');
			return;
		}
		
		//window.location.href = '/attemptLogin/?username=' + $scope.username + '&password=' + $scope.password;
		var url =  '/attemptLogin/?username=' + $scope.username + '&password=' + $scope.password;
		$http({
			method: 'GET',
			url: url
		}).then( function (res) {
			alert('authorized! logging in...');
			window.location.href = '/main';
		}, function (res) {
			alert(res.status);
			if (res.status === 401){
				alert('unauthorized');
			} else {
				alert('unknown error');
			}
		});
	}
});