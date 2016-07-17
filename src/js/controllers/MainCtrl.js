//js/controllers/LoginCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window','$scope', '$http', '$mdToast', '$location',
		 function ($window, $scope, $http, $mdToast, $location) {
		 var vm = this;
		 var pictureSource,
		 destinationType;
		$scope.images = [];
	   
	   vm.clear = function() {
            for (var i = 0; i < $scope.images.length; i++){
                var canvas = document.getElementById('canvas' + i).remove();
            }
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
                    vm.loadImage(results[i], i);
                  }
			 }); 
		};
        
        vm.loadImage = function(image, ctr) {
            var parent = document.getElementById('images');
            var canvas = document.createElement('canvas');
            var canvasId = 'canvas' + ctr;
            canvas.setAttribute('id', canvasId);
            var context = canvas.getContext('2d');
                                                
            var img = new Image();
            img.src = image;
                                                       
            img.onload = function(){
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(this, 0, 0, img.width, img.height);
            }
                                                       
            parent.appendChild(canvas);
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }; 
      
		vm.submitPhotos = function () {
		   for (var i = 0; i < $scope.images.length; i++){
			     var canvas = document.getElementById('canvas' + i);
           var encoded = canvas.toDataURL('image/png|gif|jpg|jpeg');
           vm.sendPhoto(encoded);
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