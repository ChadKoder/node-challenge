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
				 vm.showSimpleToast('Photo saved successfully!');
				 
				}).error(function(){
				  vm.showSimpleToast('Failed to save photo.');
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
            canvas.setAttribute('style', 'width: 70%; height: 70%;');
            var context = canvas.getContext('2d');

            var img = new Image();
            img.src = image;

            img.onload = function(){
				canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(this, 0, 0);
            }

            parent.appendChild(canvas);

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        
        vm.getEncodedImageById = function (id) {
            var canvas = document.getElementById(id);
            return canvas.toDataURL('image/png|gif|jpg|jpeg');
        };
      
		vm.submitPhotos = function () {
		   for (var i = 0; i < $scope.images.length; i++){
               var encoded = vm.getEncodedImageById('canvas' + i);
               vm.sendPhoto(encoded);
		   }
		};
		 
		vm.showSimpleToast = function (msg){
			$mdToast.showSimple(msg);
		};
}]);