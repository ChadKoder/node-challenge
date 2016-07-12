/*
 * controllers v  (build 20160712_105200_1)
 * Copyright (c) 2016
 * Author: Chad Keibler 
 */

//js/controllers/ConfigurationCtrl.js
angular.module('ConfigurationCtrl', []).controller('ConfigurationCtrl', ['$rootScope', '$http', '$mdToast', '$location',
 function ($rootScope, $http, $mdToast, $location) {
   	var vm = this;
	var redirectDelay = 1000;
	vm.title = 'NodeJS Sample Application';
	$rootScope.isLoggedIn = true;
	vm.redir = function(url){
		$location.path(url);
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
//js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginCtrl', ['$rootScope', '$scope','$http', '$mdToast', '$location', '$base64',
		 function ($rootScope, $scope,  $http, $mdToast, $location, $base64) {
		// var vm = this;
		 var pictureSource,
		 destinationType;
		 $scope.images = [];
                                                         
                                                         alert('device ready?');
        
		 document.addEventListener('deviceready', onDeviceReady, false);
		 function onDeviceReady() {
                                                         alert('device ready!');
			alert(navigator.camera);
			//pictureSource = navigator.camera.PictureSourceType;
			//destinationType = navigator.camera.DestinationType;
		 };
		 
		 $scope.cameraSuccess = function(imageUri) {
			//vm.images.push(imageUri);
			console.log('got pic: ' + imageUri);
		 };
                                                         
                                                         $scope.test = function(){
                                                         alert('test');
                                                         };
		 
		 
		 $scope.showCameraRoll1 = function () {
			 window.imagePicker.getPictures(function(results) {
				//alert('total pics: ' + results.length);
				//data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
				alert('total pics: ' + results.length);
				
				for (var i = 0; i < results.length; i++){
					var encodedImg = $base64.encode(results[i]);
					
					if ($scope.images) {
						$scope.images.push(encodedImg);
						//alert('adding to list');
						//vm.images.push(results[i]);
						//window.plugins.Base64.encodeFile(results[i], function(base64) {
							//vm.images.push(base64);
						//});
					} else {
						$scope.images = [encodedImg];
						//alert('adding FIRST to list');
						//vm.images = [ results[i] ];
						//window.plugins.Base64.encodeFile(results[i], function(base64) {
//							vm.images = [base64];
						//});
						
					}
				}
				
				
				
				/*var req = {
					method: 'POST',
					url: '/photo',
					data: { imagedata: results[0] }
				};
								 
				 $http(req).success(function(){
					 alert('photo saved successfully!');
					 
					}).error(function(){
					 alert('failed to save photo :(');
				 });*/
                                            }, function (err) {
                                            alert('error: ' + err);
                                            });
		 };
		 
		 $scope.cameraError = function () {
			alert('error!') ;
		 };
		 
		 $scope.showCameraRoll = function (){
			  
		  var options = {
		  quality: 50,
		  destinationType: navigator.camera.DestinationType.FILE_URI,
		  sourceType: navigator.camera.DestinationType.PHOTOLIBRARY,
		  targetWidth: 200,
		  targetHeight: 200
		  };
		 
		    navigator.camera.getPicture($scope.cameraSuccess, $scope.cameraError, options);
		 };
		 
		 
		 $scope.init = function () {
		 $scope.username = '';
		 $scope.password = '';
		 $rootScope.isLoggedIn = false;
		 $scope.redirectDelay = 1000;
		 };
		 $scope.showSimpleToast = function (msg){
		 $mdToast.showSimple(msg);
		 };
		 
		 $scope.redir = function(url){
		 setTimeout(function(){
					$location.path(url);
					}, $scope.redirectDelay);
		 };
		 
		 $scope.login = function (){
		 if (!$scope.username || !$scope.password){
		 $scope.showSimpleToast('username and password are required!');
		 return;
		 }
		 
		 var encodedAuth = btoa($scope.username + ':' + $scope.password);
		 $http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
		 
		 var req = {
		 method: 'GET',
		 url: '/validateUser',
		 data: { config: $scope.selectedConfig }
		 };
		 
		 $http(req).success(function(){
							$scope.showSimpleToast('Login Successful! redirecting...');
							$scope.redir('/user-configurations');
							}).error(function(res){
									 if (res === '401 Unauthorized'){
									 $scope.showSimpleToast('Unauthorized user!');
									 } else {
									 $scope.showSimpleToast('an error has occurred.');
									 }
									 });
		 };
}]);