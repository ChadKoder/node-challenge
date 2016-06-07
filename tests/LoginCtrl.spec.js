describe('LoginCtrl', function () {
    var ctrl,
        $rootScope,
        $scope,
		$mdToast;

    beforeEach(function(){
		module('sampleApp');
	});

    beforeEach(function () {
		$mdToast = jasmine.createSpyObj('$mdToast', ['showSimple']);

        inject(function ($injector, $controller) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
			
            ctrl = $controller('LoginCtrl', {
                $scope: $scope,
				$mdToast: $mdToast
            });
        });
    });

    describe('$scope.showSimpleToast()', function () {
        beforeEach(function () {
			$scope.showSimpleToast('test');
			
        });

        it('should display toast message', function () {
           expect($mdToast.showSimple).toHaveBeenCalled();
        });
    });
   
});