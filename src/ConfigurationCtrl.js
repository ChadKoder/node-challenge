angular.module('sampleApp.controllers', []).
controller('ConfigurationCtrl', function($scope, $http) {
	$scope.logout = function (){
		//window.location.href = '/';
	};
	
	$scope.selectedConfig = null;
	$scope.editing = false;
	$scope.title = 'Node.js Sample Application';
	
	$scope.showSimpleToast = function (msg){
		$mdToast.show(
				$mdToast.simple()
				.textContent(msg)
				.position('right')
				.hideDelay(redirectDelay)
			);
	};
	
	$scope.editConfig = function (config){
		$scope.selectedConfig = config;
		$scope.editing = true;
	};
	
	$scope.cancelEdit = function(){
		$scope.selectedConfig = null;
	};
	
	$scope.updateConfig = function(){
		
	};
	
	$scope.deleteConfig = function(){
		var url =  '/configs';
		$http({
			method: 'DELETE',
			url: url
		}).then(function (res) {
			$scope.showSimpleToast('Configuration Deleted');
			//$scope.configs = res.data.configurations;
		}, function (res) {
			if (res.status === 401){
				$scope.showSimpleToast('Unauthorized user!');
			} else {
				$scope.showSimpleToast('unknown error has occurred.');
			}
		});
	};
	
	$scope.getConfigs = function() {
		var url =  '/configs';
		$http({
			method: 'GET',
			url: url
		}).then(function (res) {
			$scope.configs = res.data.configurations;
		
		}, function (res) {
			if (res.status === 401){
				$scope.showSimpleToast('Unauthorized user!');
			} else {
				$scope.showSimpleToast('unknown error has occurred.');
			}
		});
	};
	
	$scope.init = function(){
		$scope.configs = $scope.getConfigs();
	};
	
	$scope.init();
});