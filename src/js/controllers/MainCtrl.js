//js/controllers/LoginCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window','$scope', '$http', '$mdToast', '$location', '$base64',
		 function ($window, $scope, $http, $mdToast, $location, $base64) {
		 var vm = this;
		 var pictureSource,
		 destinationType;
		 $scope.images = [];
	   
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

		vm.addImage = function(base64Image) {
			$scope.images.push(base64Image);
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		};
		 
		 vm.readFile = function(file){
			  var reader = new FileReader();
			  
			  reader.onloadend = function(e) {
				var content = this.result;
				
                vm.addImage(content);
			  };
			  
			  reader.readAsDataURL(file);
		 };
		 
		vm.receivedFileSuccess = function(imgFile){
			imgFile.file(vm.readFile);
		};
		
		vm.receivedFileFailure = function(e) {
			alert('failed to read file: ' + e);
		};
				
		vm.convertImageToBase64 = function(path) {
		   $window.resolveLocalFileSystemURL(path, vm.receivedFileSuccess, vm.receivedFileFailure); 
		};
              
		vm.getBase64Image = function (imgElem) {
			// imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
			var canvas = document.createElement("canvas");
			canvas.width = imgElem.clientWidth;
			canvas.height = imgElem.clientHeight;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(imgElem, 0, 0);
			var dataURL = canvas.toDataURL("image/png");
			return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};
		vm.showCameraRoll = function () {
			 $window.imagePicker.getPictures(function(results) {
				 for (var i = 0; i < results.length; i++){
					vm.convertImageToBase64(results[i]);
					//vm.getBase64Image(results[i]);
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
		  
		 vm.init = function () {
			 vm.redirectDelay = 1000;
		 };
		 
		 vm.showSimpleToast = function (msg){
			$mdToast.showSimple(msg);
		 };
}]);