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
			data: { config: $scope.selectedConfig }
		};
		$http(req).success(function(){
			$scope.configs = $scope.getConfigs();
			$scope.selectedConfig = null;
			$scope.editing = false;
			$scope.adding = false;
			$scope.showSimpleToast('Configuration updated successfully');
		}).error(function(){
			$scope.showSimpleToast('Configuration failed to update');
		});
	};
	
	$scope.deleteConfig = function(){
		var url =  '/configs?id=' + $scope.selectedConfig.username;
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
			url: '/configs?page=' + $scope.page + '&sortby=' + $scope.sortby,
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
	
	$scope.getPrev = function(){
		var prevPage = $scope.page - 1;
		$http.get('/configs?page=' + prevPage + '&sortby=' + $scope.sortValue)
			.then(function (res) {
				$scope.configs = res.data;
				$scope.page = prevPage;
			}, function (res){
				if (res.status === 401){
					$scope.showSimpleToast('Unauthorized user!');
				} else {
					$scope.showSimpleToast('Unable to retrieve configs.');
				}
			});
	};
	
	$scope.getNext = function(){
		var nextPage = $scope.page + 1;
		$http.get('/configs?page=' + nextPage + '&sortby=' + $scope.sortValue)
			.then(function (res) {
				$scope.configs = res.data;
				$scope.page = nextPage;
			}, function (res){
				if (res.status === 401){
					$scope.showSimpleToast('Unauthorized user!');
				} else {
					$scope.showSimpleToast('Unable to retrieve configs.');
				}
			});
	};
	
	$scope.getConfigs = function(sortValue) {
		if (sortValue){
			$scope.sortValue = sortValue;
			$http.get('/configs?page=1&sortby=' + sortValue)
			.then(function (res) {
				$scope.showSimpleToast('sorting by ' + sortValue + ' and displaying page 1');
				$scope.configs = res.data;
				$scope.page = 1;
				$scope.sortby = 'name';
			}, function (res){
				if (res.status === 401){
					$scope.showSimpleToast('Unauthorized user!');
				} else {
					$scope.showSimpleToast('Unable to retrieve configs.');
				}
			});
		} else {
			$http.get('/configs?page=1&sortby=name')
			.then(function (res) {
				$scope.showSimpleToast('sorting by ' + sortValue + ' and displaying page 1');
				$scope.page = 1;
				$scope.sortby = 'name';
				$scope.configs = res.data;
			}, function (res){
				if (res.status === 401){
					$scope.showSimpleToast('Unauthorized user!');
				} else {
					$scope.showSimpleToast('Unable to retrieve configs.');
				}
			});
		}
	};
	
	$scope.sort = function(sortBy){
		$scope.getConfigs(sortBy);
	};
	
	$scope.init = function(){
		$scope.configs = $scope.getConfigs();
		$scope.adding = false;
		$scope.selectedConfig = null;
		$scope.editing = false;
		$scope.page = 1; 
		$scope.sortValue = 'name';
	};
	
	$scope.init();
});