describe('LoginCtrl', function () {
    var ctrl,
        $rootScope,
        $scope;

    beforeEach(module('sampleApp'));

    beforeEach(function () {

        inject(function ($injector, $controller) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();

            ctrl = $controller('LoginCtrl', {
                $scope: $scope
            });
        });
    });

    describe('$scope.runUnitTests()', function () {
        beforeEach(function () {
          // spyOn(window, 'open');
         //   $scope.runUnitTests();
        });

        it('should do stuff', function () {
           expect(1).toEqual(1);
        });
    });
   
});