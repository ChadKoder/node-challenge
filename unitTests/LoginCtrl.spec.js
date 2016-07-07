describe('LoginCtrl', function () {
    var ctrl,
        $httpBackend,
		$rootScope,
		$mdToast,
		callbackSpy,
		response = 'blah',
		$window;

    beforeEach(function(){
		angular.mock.module('photoSaverApp');
	});
	
	
	beforeEach(inject(function($controller, _$rootScope_, _$httpBackend_) {
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
		$mdToast = jasmine.createSpyObj('$mdToast', ['showSimple']);
		callbackSpy = jasmine.createSpy('callbackSpy');
		
		ctrl = $controller('LoginCtrl', {
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
	
	describe('ctrl.login()', function () {
		beforeEach(function(){
			ctrl.username = 'a';
			ctrl.password = 'b';
			spyOn(ctrl, 'redir');
			
			$httpBackend.expectGET('/validateUser').respond(response);
			ctrl.login();
		});
		
        it('should send http GET and redirect', function () {
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
  
			expect(ctrl.redir).toHaveBeenCalled();
        });
		
		it('with no credentials shows toast with error', function(){
			ctrl.username = '';
			ctrl.password = '';
			spyOn(ctrl, 'showSimpleToast');
			ctrl.login();
			expect(ctrl.showSimpleToast).toHaveBeenCalled();
		});
    });
	
	it('ctrl.init should initialize values correctly', function() {
		ctrl.username = 'name';
		ctrl.password = 'pass';
		$rootScope.isLoggedIn = true;
		ctrl.redirectDelay = 0;
		ctrl.init();
		expect(ctrl.username).toBe('');
		expect($rootScope.isLoggedIn).toBeFalsy();
		expect(ctrl.password).toBe('');
		expect(ctrl.redirectDelay).toEqual(1000);
	});
	
  
});