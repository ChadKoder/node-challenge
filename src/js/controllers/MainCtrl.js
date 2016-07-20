//js/controllers/LoginCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window','$scope', '$http', '$mdToast', '$location',
	function ($window, $scope, $http, $mdToast, $location) {
	var vm = this;
	var pictureSource,
	destinationType;
	vm.totalSent = 0;
	vm.inProgress = false;
	$scope.album = [];

	vm.clear = function() {
		for (var i = 0; i < $scope.album.length; i++){
			var canvas = document.getElementById('canvas' + i).remove();
		}
		$scope.album = [];
	};

	vm.sendPhoto = function (img){
		var req = {
			method: 'POST',
			url: 'http://192.168.1.109:8888/photo',
			data: img
		};

		$http(req).success(function(){
			vm.totalSent++;
			if (vm.totalSent === $scope.album.length) {
				vm.inProgress = false;
				vm.showSimpleToast('Photo saved successfully!');
			}
		}).error(function(){
			vm.inProgress = false;
			vm.totalSent = 0;
			vm.showSimpleToast('Failed to save photo.');
		});
	};

	vm.showCameraRoll = function () {
		$window.imagePicker.getPictures(function(results) {
			for (var i = 0; i < results.length; i++){
				var image = new Image();
				image.src = results[i];

				var photo = {
					index: i
				};

				$scope.album.push(photo);
				vm.refresh();

				var el = document.getElementById('canvas' + i);
				var context = el.getContext('2d');

				image.onload = function(){
					el.width = image.width;
					el.height = image.height;
					context.drawImage(this, 0, 0);
				}

				vm.refresh();
			}
		});

	};

	vm.refresh = function () {
		if (!$scope.$$phase) {
		$scope.$apply();
		}
	};

	vm.getEncodedImageById = function (id) {
		var canvas = document.getElementById(id);
		return canvas.toDataURL('image/png|gif|jpg|jpeg');
	};

	vm.submitPhotos = function () {
		vm.inProgress = true;
		for (var i = 0; i < $scope.album.length; i++){
			var encoded = vm.getEncodedImageById('canvas' + i);
			vm.sendPhoto(encoded);
		}
	};

		vm.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
	};
}]);