angular.module('sampleApp.controllers', []).
controller('ConfigurationCtrl', function($scope, $http, $mdToast, $window) {
	var redirectDelay = 1000;
	$scope.title = 'NodeJS Sample Application';
	
	$scope.redir = function(url){
		$window.location = url;
	}
	
	$scope.logout = function (){
		$http({
			method: 'POST',
			url: '/logout'
		}).then(function (res) {
			$scope.showSimpleToast('Logging out...');
			$scope.redir('/');
		}, function (res) {
			$scope.showSimpleToast('lougout failed... strange...');
		});
	};

	$scope.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
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
	
	$scope.getPrev = function(){
		var prevPage = $scope.page - 1;
		$http.get('/configs?page=' + prevPage + '&pagesize=' + $scope.pageSize + '&sortby=' + $scope.sortValue 
			+ '&sortorder=' + $scope.sortOrder)
			.then(function (res) {
				if (prevPage === 1){
					$scope.totalDisplayed = $scope.pageSize;
					$scope.totalConfigs = res.data.total;
				} else {
					if ($scope.totalDisplayed > $scope.totalConfigs){
						$scope.totalDisplayed = $scope.totalDisplayed - $scope.totalConfigs;
					} else {
						$scope.totalDisplayed -= $scope.configs.length;
					}
				}
				
				$scope.configs = res.data.sorted;
				$scope.totalConfigs = res.data.total;
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
		$http.get('/configs?page=' + nextPage + '&pagesize=' + $scope.pageSize + '&sortby=' + $scope.sortValue
		 + '&sortorder=' + $scope.sortOrder)
			.then(function (res) {
				$scope.page = nextPage;
				$scope.totalConfigs = res.data.total;
				$scope.configs = res.data.sorted;
				$scope.totalDisplayed += res.data.sorted.length;
				
			}, function (res){
				if (res.status === 401){
					$scope.showSimpleToast('Unauthorized user!');
				} else {
					$scope.showSimpleToast('Unable to retrieve configurations');
				}
			});
			
	};
	
	$scope.getConfigs = function() {
		$http.get('/configs?page=1' + '&pagesize=' + $scope.pageSize + '&sortby=' + $scope.sortBy + '&sortorder=' + $scope.sortOrder)
		.then(function (res) {
			$scope.showSimpleToast('sorting by ' + $scope.sortBy + ' ' + $scope.sortOrder + ' and displaying page 1');
			$scope.totalDisplayed = $scope.pageSize;
			$scope.totalConfigs = res.data.total;
			$scope.configs = res.data.sorted;
			$scope.page = 1;
			//$scope.sortby = 'name';
		}, function (res){
			if (res.status === 401){
				$scope.showSimpleToast('Unauthorized user!');
			} else {
				$scope.showSimpleToast('Unable to retrieve configs.');
			}
		});
	};
	
	$scope.sort = function(sortBy){
		$scope.sortBy = sortBy;
		$scope.toggleSortOrder();
		$scope.getConfigs(sortBy);
	};
	
	$scope.toggleSortOrder = function (){
		if ($scope.sortOrder === 'asc'){
			$scope.sortOrder = 'desc';
		} else {
			$scope.sortOrder = 'asc';
		}
	};
	
	$scope.init = function(){
		$scope.adding = false;
		$scope.selectedConfig = null;
		$scope.editing = false;
		$scope.page = 1; 
		$scope.sortBy = 'name';
		$scope.pageSize = 5;
		$scope.totalDisplayed = 0;
		$scope.sortOrder = 'asc';
		$scope.configs = $scope.getConfigs();
	};
	
	$scope.init();
});