angular.module('sampleApp.controllers', []).
controller('ConfigurationCtrl', function($scope, $http, $mdToast) {
	var redirectDelay = 1000;
	
	$scope.logout = function (){
		$http({
			method: 'POST',
			url: '/logout'
		}).then(function (res) {
			$scope.showSimpleToast('Logging out...');
			window.location.href = '/';
		}, function (res) {
			$scope.showSimpleToast('lougout failed... strange...');
		});
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
		var url =  '/configs/?' + $scope.selectedConfig.username;
		$http({
			method: 'DELETE',
			url: url
		}).then(function (res) {
			$scope.configs = $scope.getConfigs();
			$scope.selectedConfig = null;
			$scope.showSimpleToast('Configuration deleted');
		}, function (res) {
			$scope.showSimpleToast('Deletion failed');
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