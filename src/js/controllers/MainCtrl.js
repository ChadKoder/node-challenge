//js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainCtrl', ['$window','$scope', '$http', '$mdToast', '$location', 'Upload',
	function ($window, $scope, $http, $mdToast, $location, Upload) {
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
	vm.imageFile = null;
    
    $scope.submit = function (){
        var formData = new FormData();
        formData.enctype = "multipart/form-data";
        
        angular.forEach($scope.files, function (obj) {
           //alert('file: ' + JSON.stringify(obj));
           formData.append('file', obj.lfFile);
            
        });
        
         
       $http.post('http://192.168.1.109:8888', formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
            }).then(function(result) {
               alert('success...');
            }, function (err) {
                alert('error: ' + JSON.stringify(err));
            });
    };
	
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
    
    vm.success = function(){
        alert('upload successful');
    };
    
    vm.failure = function() {
       alert('upload failed');
    };
    
    vm.takePicAndSend = function () {
       var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
		}
        
    };
    
    vm.uploadFile = function() {
		var file = $vm.imageFile;
		var uploadUrl = '/';
		//$upload.uploadFileToUrl(file, uploadUrl);
		
		Upload.upload({
            url: '192.168.1.109:21',
            data: {file: file, 'username': 'Chad'}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
	};
    
	
   vm.sendPhoto = function (img) {

   // var action = {
       // testFtp: function() {
          
                 
     //     $window.plugins.ftpUpload.sendFile(vm.success, vm.failure, '192.168.1.109:21', 'Chad', 'pass', img);
          
          //var remoteFile = '/Images/' + img.substr(img.lastIndexOf('/') + 1);
          
            $window.cordova.plugin.ftp.connect('192.168.1.109:21', 'Chad', 'pass', function() {
          alert('connected!');
               // $window.cordova.plugin.ftp.upload(img, 'C:/Users/Chad/Desktop/Images/test/test.jpeg', function (percent) {
             //  $window.cordova.plugin.ftp.upload(img, 'C:\Users\Chad\Desktop\Images\
            // test123.jpg', function (percent) {
                var lastIndexSlash = img.lastIndexOf('/');
                var fileName = img.substr(lastIndexSlash);
                $window.cordova.plugin.ftp.upload(img, fileName, function (percent) {
                    if (percent == 1){
                        alert('success?');
                        vm.inProgress = false;
                      //  vm.refresh();
                    }
                },
                function (err){
                vm.inProgress = false;
                    alert('err: '  + JSON.stringify(err));
                    //vm.refresh();
                });
            });
           vm.inProgress = false;
       
};
  
    
    vm.sendWithFileTransfer = function(img) {
      var options = new FileUploadOptions();
    //   options.fileName = 'file1.jpeg';
        options.fileKey = "file";
      //  options.fileName = "testPic.jpeg";
       // options.mimeType = "text/plain";
       
        var lastIndexSlash = img.lastIndexOf('/'); 
        
        var creds = btoa('Chad:pass');
        ions.headers = headers;
          
            
        vm.inProgress = false;
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
     
          vm.sendPhoto($scope.album[i].image);
          
        }
    };
    
    vm.submitPhotos2 = function () {
        vm.inProgress = true;
        for (var i = 0; i < $scope.album.length; i++) {
            vm.sendWithFileTransfer($scope.album[i].image);
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
            
           // $scope.album[index].base64img = canvas.toDataURL('image/png|gif|jpg|jpeg');
            
            if (vm.totalLoaded === $scope.album.length) {
                vm.imagesLoaded = true;
                vm.refresh();
            }
        }
    };
    
 
    
    vm.loadImages = function() {
          
            for (var i = 0; i < $scope.album.length; i++){
                var img = new Image();
                img.src = $scope.album[i].image;
                           //  alert('loadgin img: ' + $scope.album[i].image);
                            vm.loadImage(img, i);
            }
    };
    
    vm.showCameraRoll = function() {
        $window.imagePicker.getPictures(function (results){
            for (var i = 0; i < results.length; i++){
                var photo = {
                    index: i,
                    image: results[i]
                }
                
                 $scope.album.push(photo);
                // alert('added photo');
                  vm.refresh();
              
              //  vm.loadImage();
            
            }
			
			vm.imageFile = $scope.album[0].image;
            //vm.loadImages();
           // vm.albumSelected = true;
           // vm.refresh();
            
        },
        function (err) {
            alert('error: ' + err);
        },
        {
            width: 800,
            quality: 45
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