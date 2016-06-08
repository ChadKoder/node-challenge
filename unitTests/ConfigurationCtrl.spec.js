describe('ConfigurationCtrl', function () {
    var ctrl,
        $rootScope,
        $scope,
		$httpBackend,
		$mdToast,
		$window,
		response = 'blah',;

    beforeEach(function(){
		module('sampleApp');
	});

    beforeEach(function () {
		//$mdToast = jasmine.createSpyObj('$mdToast', ['showSimple']);
		//callbackSpy = jasmine.createSpy('callbackSpy');
		
        inject(function ($injector, $controller, _$httpBackend_) {
            $rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			//$window = $injector.get('$window');
            $httpBackend = _$httpBackend_;
			
            ctrl = $controller('ConfigurationCtrl', {
                $scope: $scope
            });			 
        });
    });

    /*describe('$scope.logout()', function () {
        beforeEach(function () {
			$httpBackend.expectPOST('/logout').respond(response);
			$scope.logout();
        });

        it('should display toast message', function () {
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
        });
    });*/
	
	
});