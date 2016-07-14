describe('MainCtrl', function () {
    var ctrl,
        $httpBackend,
		$rootScope,
		$scope,
		$mdToast,
		callbackSpy,
		$scope = {},
		response = 'blah',
		windowMock, 
		$window;
		

    beforeEach(function(){
		angular.mock.module('photoSaverApp', function($provide){
			
			$window = {
				imagePicker: { 	
					getPictures: jasmine.createSpy('imagePicker.getPictures')
				}
			};
			
			//windowMock.imagePicker.getPictures = jasmine.createSpy('window.imagePicker.getPictures');
			
			$provide.value('$window', $window);
		});
	});
	
	
	beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_) {
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		$mdToast = jasmine.createSpyObj('$mdToast', ['showSimple']);
		callbackSpy = jasmine.createSpy('callbackSpy');
		 
		ctrl = $controller('MainCtrl', {
			$scope: $scope,
			 $rootScope: $rootScope,
			 $mdToast: $mdToast
		});
	}));
	
   describe('ctrl.showSimpleToast()', function () {
        beforeEach(function () {
			ctrl.showSimpleToast('test');
        });

        it('should display toast message', function () {
           expect($mdToast.showSimple).toHaveBeenCalled();
        });
    });
	
	describe('ctrl.showCameraRoll()', function () {
		beforeEach(function(){
			$scope.images = [];
			
			//$httpBackend.expectGET('/validateUser').respond(response);
			ctrl.showCameraRoll();
		});
		
        it('should set $scope.images', function () {
			expect($window.imagePicker.getPictures).toHaveBeenCalled();
			//$httpBackend.flush();
		//	$httpBackend.verifyNoOutstandingExpectation();
			//$httpBackend.verifyNoOutstandingRequest();
  
			//expect(ctrl.redir).toHaveBeenCalled();
        });
		
		 
    }); 
	
  
});