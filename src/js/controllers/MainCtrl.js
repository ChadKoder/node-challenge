/*
 * controllers v  (build 20160720_134703_1)
 * Copyright (c) 2016
 * Author: Chad Keibler 
 */

//js/controllers/LoginCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window','$scope', '$http', '$mdToast', '$location', '$cordovaFileTransfer',
	function ($window, $scope, $http, $mdToast, $location, $cordovaFileTransfer) {
	var vm = this;
	var pictureSource,
	destinationType;
	vm.totalSent = 0;
	vm.inProgress = false;
	$scope.album = [];
    vm.album = null;
	vm.albumSelected = false;
    vm.totalLoaded = 0;
	vm.albumLoaded = false;

	vm.clear = function() {
		for (var i = 0; i < $scope.album.length; i++){
			var canvas = document.getElementById('canvas' + i).remove();
		}
		$scope.album = [];
        vm.totalSent = 0;
        vm.imagesLoaded = false;
		vm.albumSelected = false;
		vm.albumLoaded = false;
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
    
    vm.getEncodedImageById = function (id) {
        var canvas = document.getElementById(id);
        return canvas.toDataURL('image/png|gif|jpg|jpeg');
    };
    
    vm.sleep = function(milliseconds) {
        var start = new Date().getTime();
        for(var i = o; i < 1e7; i++){
            if((new Date().getTime() - start) > millisecond) {
                break;
            }
        }
    };
                                                   
    vm.submitPhotos = function () {
        vm.inProgress = true;
        for (var i = 0; i < $scope.album.length; i++){
            vm.sendPhoto($scope.album[i].base64img);
            vm.sleep(1000);
        }
    };
             
   /* vm.getBase64s = function() {
        for (var i = 0; i < $scope.album.length; i++){
            $scope.album[i].base64img = vm.getEncodedImageById('canvas' + i);
            vm.refresh();
        }
    };*/
    
    vm.loadImage = function(img, index) {
		img.onload = function() {
			var canvas = document.getElementById('canvas' + index);
            var context = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(this, 0, 0);
            
            vm.totalLoaded++;
            
            $scope.album[index].base64img = canvas.toDataURL('image/png|gif|jpg|jpeg');
            
            if (vm.totalLoaded === $scope.album.length) {
                vm.imagesLoaded = true;
                vm.refresh();
            }
        }
    };
    
 
    
    vm.loadImages = function() {
        /*var processed = 0;
         if ($scope.album.length > 5) {
             
             for (var i = 0; i < $scope.album.length; i++){
                if (processed % 5 === 0) {
                    vm.sleep(3000);
                }
                var img = new Image();
                img.src = $scope.album[i].image;
                                        
                vm.loadImage(img, i);
                processed++;
             }
             
             
             
            // vm.sleep(1000);
             
             
             
             
             
         } else {*/
          
            for (var i = 0; i < $scope.album.length; i++){
                var img = new Image();
                img.src = $scope.album[i].image;
                             
                vm.loadImage(img, i);
            }
        // }
    
    
    
		
		//vm.albumSelected = true;
    };
    
    vm.showCameraRoll = function() {
        $window.imagePicker.getPictures(function (results){
            for (var i = 0; i < results.length; i++){
                var photo = {
                    index: i,
                    image: results[i],
                    base64img: null
                }
                
                 $scope.album.push(photo);
                  vm.refresh();
            }
			
            //vm.loadImages();
            vm.albumSelected = true;
            vm.refresh();
        });
    };

	vm.refresh = function () {
		if (!$scope.$$phase) {
		$scope.$apply();
		}
	};

    vm.showSimpleToast = function (msg){
		$mdToast.showSimple(msg);
	};
	
	vm.viewAlbum = function(){
		vm.loadImages();
		//vm.albumSelected = false;
		vm.albumLoaded = true;
        vm.refresh();
		
	};
}]);