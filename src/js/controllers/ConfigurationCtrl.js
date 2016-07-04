//js/controllers/ConfigurationCtrl.js
angular.module('photoSaver.controllers', []).controller('ConfigurationCtrl', ['$http', '$mdToast', '$location',
 function ($http, $mdToast, $location) {
   	var vm = this;
	var redirectDelay = 1000;
	vm.title = 'NodeJS Sample Application';
	
	vm.redir = function(url){
		//$window.location = url;
		$location.path(url);
	};
	
	vm.logout = function (){
		$http({
			method: 'POST',
			url: '/logout'
		}).then(function (res) {
			vm.showSimpleToast('Logging out...');
			vm.redir('/');
		}, function (res) {
			vm.showSimpleToast('lougout failed... strange...');
		});
	};

	vm.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
	};
	
	vm.editConfig = function (config){
		vm.selectedConfig = config;
		vm.editing = true;
	};
	
	vm.cancelEdit = function(){
		vm.selectedConfig = null;
		vm.editing = false;
		vm.adding = false;
	};
	
	vm.updateConfig = function(){
		var req = {
			method: 'PUT',
			url: '/configs',
			headers: {
				'Content-Type': 'application/json'
			},
			data: { config: vm.selectedConfig }
		};
		$http(req).success(function(){
			vm.configs = vm.getConfigs();
			vm.selectedConfig = null;
			vm.editing = false;
			vm.adding = false;
			vm.showSimpleToast('Configuration updated successfully');
		}).error(function(){
			vm.showSimpleToast('Configuration failed to update');
		});
	};
	
	vm.deleteConfig = function(){
		var url =  '/configs?id=' + vm.selectedConfig.username;
		$http.delete(url)
			.then(function (res) {
				vm.configs = vm.getConfigs();
				vm.selectedConfig = null;
				vm.editing = false;
				vm.showSimpleToast('Configuration deleted');
			}, function () {
				vm.showSimpleToast('Deletion failed');
			});
	};
	
	vm.addConfig = function(){
		if (!vm.selectedConfig.name || !vm.selectedConfig.hostname || !vm.selectedConfig.port || !vm.selectedConfig.username){
			vm.showSimpleToast('All values are required.');
			return;
		}
		
		var req = {
			method: 'POST',
			url: '/configs',
			headers: {
				'Content-Type': 'application/json'
			},
			data: { config: vm.selectedConfig }
		};
		
		$http(req).success(function(){
			vm.configs = vm.getConfigs();
			vm.selectedConfig = null;
			vm.adding = false;
			
			vm.showSimpleToast('Configuration updated successfully');
			
		}).error(function(){
			vm.showSimpleToast('Configuration failed to update');
		});
	};
	
	vm.showAdd = function(){
		vm.selectedConfig = {};
		vm.adding = true;
	};
	
	vm.getPrev = function(){
		var prevPage = vm.page - 1;
		$http.get('/configs?page=' + prevPage + '&pagesize=' + vm.pageSize + '&sortby=' + vm.sortValue +
			 '&sortorder=' + vm.sortOrder)
			.then(function (res) {
				if (prevPage === 1){
					vm.totalDisplayed = vm.pageSize;
					vm.totalConfigs = res.data.total;
				} else {
					if (vm.totalDisplayed > vm.totalConfigs){
						vm.totalDisplayed = vm.totalDisplayed - vm.totalConfigs;
					} else {
						vm.totalDisplayed -= vm.configs.length;
					}
				}
				
				vm.configs = res.data.sorted;
				vm.totalConfigs = res.data.total;
				vm.page = prevPage;
				
			}, function (res){
				if (res.status === 401){
					vm.showSimpleToast('Unauthorized user!');
				} else {
					vm.showSimpleToast('Unable to retrieve configs.');
				}
			});
			
	};
	
	vm.getNext = function(){
		var nextPage = vm.page + 1;
		$http.get('/configs?page=' + nextPage + '&pagesize=' + vm.pageSize + '&sortby=' + vm.sortValue +
		  '&sortorder=' + vm.sortOrder)
			.then(function (res) {
				vm.page = nextPage;
				vm.totalConfigs = res.data.total;
				vm.configs = res.data.sorted;
				vm.totalDisplayed += res.data.sorted.length;
				
			}, function (res){
				if (res.status === 401){
					vm.showSimpleToast('Unauthorized user!');
				} else {
					vm.showSimpleToast('Unable to retrieve configurations');
				}
			});
			
	};
	
	vm.getConfigs = function() {
		$http.get('/configs?page=1' + '&pagesize=' + vm.pageSize + '&sortby=' + vm.sortBy + '&sortorder=' + vm.sortOrder)
		.then(function (res) {
			vm.showSimpleToast('sorting by ' + vm.sortBy + ' ' + vm.sortOrder + ' and displaying page 1');
			vm.totalDisplayed = vm.pageSize;
			vm.totalConfigs = res.data.total;
			vm.configs = res.data.sorted;
			vm.page = 1;
			//vm.sortby = 'name';
		}, function (res){
			if (res.status === 401){
				vm.showSimpleToast('Unauthorized user!');
			} else {
				vm.showSimpleToast('Unable to retrieve configs.');
			}
		});
	};
	
	vm.sort = function(sortBy){
		vm.sortBy = sortBy;
		vm.toggleSortOrder();
		vm.getConfigs(sortBy);
	};
	
	vm.toggleSortOrder = function (){
		if (vm.sortOrder === 'asc'){
			vm.sortOrder = 'desc';
		} else {
			vm.sortOrder = 'asc';
		}
	};
	
	vm.init = function(){
		vm.adding = false;
		vm.selectedConfig = null;
		vm.editing = false;
		vm.page = 1; 
		vm.sortBy = 'name';
		vm.pageSize = 5;
		vm.totalDisplayed = 0;
		vm.sortOrder = 'asc';
		vm.configs = vm.getConfigs();
	};
	
	vm.init();
}]);