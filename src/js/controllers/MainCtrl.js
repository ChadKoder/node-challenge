//js/controllers/LoginCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window','$scope', '$http', '$mdToast', '$location',
		 function ($window, $scope, $http, $mdToast, $location) {
		 var vm = this;
		 var pictureSource,
		 destinationType;
		 $scope.images = [],
		 vm.deviceReady = false;
		 
		/* document.addEventListener("deviceready", onDeviceReady, false);
		 
		 function onDeviceReady() {
			 vm.deviceReady = true;
                                                       
             if (!$scope.$$phase) {
                $scope.$apply();
             }
        };*/
		 
		 /*vm.cameraSuccess = function(imageUri) {
			//vm.images.push(imageUri);
			console.log('got pic: ' + imageUri);
		 };*/
	   
	   vm.clear = function() {
			$scope.images = [];
	   };
	   
		vm.sendPhoto = function (img){
			  var req = {
				method: 'POST',
				url: 'http://192.168.1.109:8888/photo',
				data: img
			};
								 
			 $http(req).success(function(){
				 alert('photo saved successfully!');
				 
				}).error(function(){
				 alert('failed to save photo.');
			 });
		 };
		 
		 vm.showCameraRoll = function () {
			 $window.imagePicker.getPictures(function(results) {
				for (var i = 0; i < results.length; i++){
					$scope.images.push(results[i]); 
					//vm.sendPhotos(results[i]);
				}
				
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			 });
		 };
		 
		 vm.submitPhotos = function () {
			 for (var i = 0; i < $scope.images.length; i++){
				vm.sendPhoto($scope.images[i]);
			 }
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