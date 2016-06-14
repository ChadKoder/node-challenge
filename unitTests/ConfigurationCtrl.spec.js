describe('ConfigurationCtrl', function () {
    var ctrl,
        $rootScope,
        $scope,
		responseNoSort = { sorted: [{a:'a'}] ,total: 7 },
		responseSort = { sorted: [{a:'b'}] ,total: 23 },
		$mdToast,
		$httpBackend;

    beforeEach(function(){
		module('sampleApp');
	});

    beforeEach(function () {
		$mdToast = jasmine.createSpyObj('$mdToast', ['showSimple']);
        inject(function ($injector, $controller, _$httpBackend_) {
            $rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$httpBackend = _$httpBackend_;
			
			ctrl = $controller('ConfigurationCtrl', {
				$scope: $scope,
				$mdToast: $mdToast
			});
        });
		
		$httpBackend.expectGET('/configs?page=1&sortby=name').respond(responseNoSort);
	});
			 
	describe('$scope.init()', function(){
		beforeEach(function(){
			spyOn($scope, 'getConfigs');
			$scope.init();
		});
		
		it('should call $scope.getConfigs', function(){
			expect($scope.getConfigs).toHaveBeenCalled();
		});
		
		it ('should default page, sortValue, totalDisplayed, and pageSize', function(){
			expect($scope.adding).toBeFalsy();
			expect($scope.selectedConfig).toBe(null);
			expect($scope.editing).toBeFalsy();
			expect($scope.page).toEqual(1);
			expect($scope.pageSize).toEqual(5);
			expect($scope.totalDisplayed).toEqual(0);
		});
	});
	 	
	describe('$scope.editConfg', function(){
		it('should set $scope.selectedConfig', function (){
			$scope.selectedConfig = 'NotEdit';
			$scope.editConfig('edit');
			expect($scope.selectedConfig).toBe('edit');
		});
	});
	
	describe('$scope.sort', function(){
		beforeEach(function(){
			spyOn($scope, 'getConfigs');
			$scope.sort('name');
		});
		
		it('should call $scope.getConfigs', function(){
			expect($scope.getConfigs).toHaveBeenCalledWith('name');
		});
	});
	
	describe('$scope.getConfigs with no sort value', function(){
		beforeEach(function(){
			$scope.sortValue = null;
			$scope.pageSize = 5;
			$scope.page = 0;
			$scope.totalDisplayed = 0;
			$scope.totalConfigs = 0;
			$scope.configs = null;
			$httpBackend.expectGET('/configs?page=1&sortby=name').respond(responseNoSort);
			$scope.getConfigs(null);
		});
		
		it('should set the sort value and pageSize', function(){
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			expect($scope.sortValue).toBe(null); 
			expect($scope.totalDisplayed).toBe($scope.pageSize); 
			expect($scope.page).toBe(1); 
			expect($scope.totalConfigs).toBe(7); 
			expect($scope.configs.length).toEqual(1);
		});
	});
	
	describe('$scope.getConfigs with a sort value', function(){
		beforeEach(function(){
			$scope.sortValue = null;
			$scope.pageSize = 5;
			$scope.page = 0;
			$scope.totalDisplayed = 0;
			$scope.totalConfigs = 0;
			$scope.configs = null;
			$scope.sortOrder = 'asc';
			$httpBackend.expectGET('/configs?page=1&sortby=name&sortorder=asc').respond(responseSort);
			$scope.getConfigs('name');
		});
		
		it('should set the sort value and pageSize', function(){
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			expect($scope.sortValue).toBe('name'); 
			expect($scope.totalDisplayed).toBe($scope.pageSize); 
			expect($scope.page).toBe(1); 
			expect($scope.totalConfigs).toBe(23); 
			expect($scope.configs.length).toEqual(1);
		});
	});
	
	describe('$scope.getConfigs with http 401 Unauthorized', function () {
		beforeEach(function(){
			$scope.sortValue = null;
			$scope.pageSize = 5;
			$scope.page = 0;
			$scope.totalDisplayed = 0;
			$scope.totalConfigs = 0;
			$scope.configs = null;
			$httpBackend.expectGET('/configs?page=1&sortby=name&sortorder=asc').respond(401);
			$scope.getConfigs('name');
			
		});
		
		it ('should show error msg', function(){
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			
			expect($mdToast.showSimple).toHaveBeenCalledWith('Unauthorized user!');
		});
		
	});
	
});