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
			alert('success');
		}).error(function(){
			alert('failure');
		});
		/*($http.put('/configs', $scope.selectedConfig)
			.then(function (res) {
				$scope.showSimpleToast('Updated configurations!');
			}, function () {
				$scope.showSimpleToast('Failed to update configuration');
		});*/
	};
	
	$scope.deleteConfig = function(){
		var url =  '/configs/?' + $scope.selectedConfig.username;
		$http.delete(url)
			.then(function (res) {
				$scope.configs = $scope.getConfigs();
				$scope.selectedConfig = null;
				$scope.showSimpleToast('Configuration deleted');
			}, function () {
				$scope.showSimpleToast('Deletion failed');
			});
	};
	
	$scope.showAdd = function(){
		$scope.showAddConfig = true;
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
		$scope.showAddConfig = false;
		$scope.selectedConfig = null;
		$scope.editing = false;
	};
	
	$scope.init();
});