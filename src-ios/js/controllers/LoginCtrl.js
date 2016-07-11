//js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginCtrl', ['$rootScope', '$http', '$mdToast', '$location',
		 function ($rootScope, $http, $mdToast, $location) {
		 var vm = this;
		 var pictureSource,
		 destinationType,
		 images = {};
		 
		 document.addEventListener("deviceready", onDeviceReady, false);
		 function onDeviceReady() {
		 alert('device ready!');
		 alert(navigator.camera);
		 pictureSource = navigator.camera.PictureSourceType;
		 destinationType = navigator.camera.DestinationType;
		 };
		 
		 vm.cameraSuccess = function(imageUri) {
		 vm.images.push(imageUri);
		 };
		 
		 vm.showCameraRoll = function (){
		 window.imagePicker.getPictures(function(results) {
										alert('total pics: ' + results.length);
										});
		 /* var options = {
		  quality: 50,
		  destinationType: navigator.camera.DestinationType.FILE_URI,
		  sourceType: navigator.camera.DestinationType.PHOTOLIBRARY,
		  targetWidth: 200,
		  targetHeight: 200
		  };*/
		 
		 //   navigator.camera.getPicture(vm.cameraSuccess, vm.cameraError, options);
		 };
		 
		 
		 vm.init = function () {
		 vm.username = '';
		 vm.password = '';
		 $rootScope.isLoggedIn = false;
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
		 
		 vm.login = function (){
		 if (!vm.username || !vm.password){
		 vm.showSimpleToast('username and password are required!');
		 return;
		 }
		 
		 var encodedAuth = btoa(vm.username + ':' + vm.password);
		 $http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
		 
		 var req = {
		 method: 'GET',
		 url: '/validateUser',
		 data: { config: vm.selectedConfig }
		 };
		 
		 $http(req).success(function(){
							vm.showSimpleToast('Login Successful! redirecting...');
							vm.redir('/user-configurations');
							}).error(function(res){
									 if (res === '401 Unauthorized'){
									 vm.showSimpleToast('Unauthorized user!');
									 } else {
									 vm.showSimpleToast('an error has occurred.');
									 }
									 });
		 };
}]);