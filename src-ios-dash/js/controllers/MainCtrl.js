//js/controllers/LoginCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$scope', '$http', '$mdToast', '$location', '$base64',
		 function ($scope, $http, $mdToast, $location, $base64) {
		 var vm = this;
		 var pictureSource,
		 destinationType;
		 $scope.images = [];
		 
		 document.addEventListener("deviceready", onDeviceReady, false);
		 function onDeviceReady() {
			//alert(navigator.camera);
			//pictureSource = navigator.camera.PictureSourceType;
			//destinationType = navigator.camera.DestinationType;
		 };
		 
		 vm.cameraSuccess = function(imageUri) {
			//vm.images.push(imageUri);
			console.log('got pic: ' + imageUri);
		 };
		 
		 vm.sendPhotos = function (img){
			 alert('attempting to send base64 image: ' + img);
			  var req = {
				method: 'POST',
				url: 'http://192.168.1.109:8888/photo',
				data: { imagedata: img }
			};
								 
			 $http(req).success(function(){
				 alert('photo saved successfully!');
				 
				}).error(function(){
				 alert('failed to save photo :(');
			 });
		 };
		 
		 vm.showCameraRoll = function () {
			 window.imagePicker.getPictures(function(results) {
				for (var i = 0; i < results.length; i++){
					$scope.images.push(results[i]);
					window.plugins.base64.encodeFile(results[i], function(base64) {
						vm.sendPhotos(base64);
					});
						//vm.images.push(results[i]);
						//window.plugins.Base64.encodeFile(results[i], function(base64) {
							//vm.images.push(base64);
						//});
					
				}
				
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			 });
		 };
		 
		 vm.cameraError = function () {
			alert('error!') ;
		 };
		 
		/* vm.showCameraRoll = function (){
			  
		  var options = {
			  quality: 50,
			  destinationType: navigator.camera.DestinationType.FILE_URI,
			  sourceType: navigator.camera.DestinationType.PHOTOLIBRARY,
			  targetWidth: 200,
			  targetHeight: 200
		  };
		 
		    navigator.camera.getPicture(vm.cameraSuccess, vm.cameraError, options);
		 };*/
		 
		 vm.init = function () {
			 vm.redirectDelay = 1000;
		 };
		 
		 vm.showSimpleToast = function (msg){
			$mdToast.showSimple(msg);
		 };
		 
		 vm.redir = function(url){
			 setTimeout(function(){
					$location.path(url);
				}, vm.redirectDelay);
		 };		 	
		 
}]);