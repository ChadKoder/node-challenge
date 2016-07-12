//js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$mdToast', '$location', '$base64',
		 function ($rootScope, $scope, $http, $mdToast, $location, $base64) {
		// var vm = this;
		 var pictureSource,
		 destinationType;
		 $scope.images = [];
		 
		 document.addEventListener("deviceready", onDeviceReady, false);
		 function onDeviceReady() {
			//alert(navigator.camera);
			//pictureSource = navigator.camera.PictureSourceType;
			//destinationType = navigator.camera.DestinationType;
		 };
		 
		 $scope.cameraSuccess = function(imageUri) {
			//vm.images.push(imageUri);
			console.log('got pic: ' + imageUri);
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