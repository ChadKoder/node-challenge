describe('LoginCtrl', function () {
    var ctrl,
        $rootScope,
        $scope,
		$httpBackend,
		$mdToast,
		callbackSpy,
		response = 'blah',
		$window;

    beforeEach(function(){
		module('sampleApp');
	});

    beforeEach(function () {
		$mdToast = jasmine.createSpyObj('$mdToast', ['showSimple']);
		callbackSpy = jasmine.createSpy('callbackSpy');
		
        inject(function ($injector, $controller, _$httpBackend_, _$window_) {
            $rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$window = $injector.get('$window');
            $httpBackend = _$httpBackend_;
			
            ctrl = $controller('LoginCtrl', {
                $scope: $scope,
				$mdToast: $mdToast
            });
			 
        });
		spyOn($scope, 'redir');
    });

    describe('$scope.showSimpleToast()', function () {
        beforeEach(function () {
			$scope.showSimpleToast('test');
			
        });

        it('should display toast message', function () {
           expect($mdToast.showSimple).toHaveBeenCalled();
        });
    });
	
	describe('$scope.login()', function () {
		beforeEach(function(){
			$httpBackend.expectGET('/validateUser').respond(response);
			$scope.login();
			 
			
		});
        it('should send http GET and redirect', function () {
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
  
			expect($scope.redir).toHaveBeenCalled();
        });
		
    });   
});