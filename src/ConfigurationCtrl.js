angular.module('sampleApp.controllers', []).
controller('ConfigurationCtrl', function($scope, $http, $mdToast) {
	var redirectDelay = 1000;
	$scope.title = 'Node.js Sample Application';
	
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
		$scope.editing = false;
		$scope.adding = false;
	};
	
	$scope.updateConfig = function(){
		var req = {
			method: 'PUT',
			url: '/configs',
			headers: {
				'Content-Type': 'application/json'
			},
			data: { test: $scope.selectedConfig }
		};

		var req = {
			method: 'PUT',
			url: '/configs',
			headers: {
				'Content-Type': 'application/json'
			},
			data: { config: $scope.selectedConfig }
		};
		$http(req).success(function(){
			$scope.configs = $scope.getConfigs();
			$scope.selectedConfig = null;
			$scope.showSimpleToast('Configuration updated successfully');
		}).error(function(){
			$scope.showSimpleToast('Configuration failed to update');
		});
	};
	
	$scope.deleteConfig = function(){
		var url =  '/configs/?' + $scope.selectedConfig.username;
		$http.delete(url)
			.then(function (res) {
				$scope.configs = $scope.getConfigs();
				$scope.selectedConfig = null;
				$scope.editing = false;
				$scope.showSimpleToast('Configuration deleted');
			}, function () {
				$scope.showSimpleToast('Deletion failed');
			});
	};
	
	$scope.addConfig = function(){
		if (!$scope.selectedConfig.name || !$scope.selectedConfig.hostname || !$scope.selectedConfig.port || !$scope.selectedConfig.username){
			$scope.showSimpleToast('All values are required.');
			return;
		}
		
		var req = {
			method: 'POST',
			url: '/configs',
			headers: {
				'Content-Type': 'application/json'
			},
			data: { config: $scope.selectedConfig }
		};
		
		$http(req).success(function(){
			$scope.configs = $scope.getConfigs();
			$scope.selectedConfig = null;
			$scope.adding = false;
			
			$scope.showSimpleToast('Configuration updated successfully');
			
		}).error(function(){
			$scope.showSimpleToast('Configuration failed to update');
		});
	};
	
	$scope.showAdd = function(){
		$scope.selectedConfig = {};
		$scope.adding = true;
	};
	
	$scope.getConfigs = function() {
		$http.get('/configs')
			.then(function (res) {
				$scope.configs = res.data.configurations;
			}, function (res){
				if (res.status === 401){
					$scope.showSimpleToast('Unauthorized user!');
				} else {
					$scope.showSimpleToast('Unable to retrieve configs.');
				}
			});
	};
	
	$scope.init = function(){
		$scope.configs = $scope.getConfigs();
		$scope.adding = false;
		$scope.selectedConfig = null;
		$scope.editing = false;
	};
	
	$scope.init();
});