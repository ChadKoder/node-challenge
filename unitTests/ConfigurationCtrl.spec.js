describe('ConfigurationCtrl', function () {
    var ctrl,
        $rootScope,
		responseNoSort = { sorted: [{a:'a'}] ,total: 7 },
		responseSort = { sorted: [{a:'b'}] ,total: 23 },
		$mdToast,
		$httpBackend;

    beforeEach(function(){
		angular.mock.module('photoSaverApp');
	});
	
    beforeEach(function () {
		$mdToast = jasmine.createSpyObj('$mdToast', ['showSimple']);
        inject(function ($injector, $controller, _$httpBackend_) {
            $rootScope = $injector.get('$rootScope');
			$httpBackend = _$httpBackend_;
			
			ctrl = $controller('ConfigurationCtrl', {
				$rootScope: $rootScope,
				$mdToast: $mdToast
			});
        });
		
		$httpBackend.expectGET('/configs?page=1&pagesize=5&sortby=name&sortorder=asc').respond(responseNoSort);
	});
			 
	describe('ctrl.init()', function(){
		beforeEach(function(){
			spyOn(ctrl, 'getConfigs');
			ctrl.init();
		});
		
		it('should call ctrl.getConfigs', function(){
			expect(ctrl.getConfigs).toHaveBeenCalled();
			expect(ctrl.adding).toBeFalsy();
			expect(ctrl.selectedConfig).toBeFalsy();
			expect(ctrl.editing).toBeFalsy();
			expect(ctrl.page).toEqual(1);
			expect(ctrl.sortBy).toBe('name');
			expect(ctrl.pageSize).toEqual(5);
		});
		
		it ('should default page, sortValue, totalDisplayed, and pageSize', function(){
			expect(ctrl.adding).toBeFalsy();
			expect(ctrl.selectedConfig).toBe(null);
			expect(ctrl.editing).toBeFalsy();
			expect(ctrl.page).toEqual(1);
			expect(ctrl.pageSize).toEqual(5);
			expect(ctrl.totalDisplayed).toEqual(0);
		});
	});
	 	
	describe('ctrl.editConfg', function(){
		it('should set ctrl.selectedConfig', function (){
			ctrl.selectedConfig = 'NotEdit';
			ctrl.editConfig('edit');
			expect(ctrl.selectedConfig).toBe('edit');
		});
	});
	
	describe('ctrl.sort', function(){
		beforeEach(function(){
			spyOn(ctrl, 'getConfigs');
			ctrl.sort('name');
		});
		
		it('should call ctrl.getConfigs', function(){
			expect(ctrl.getConfigs).toHaveBeenCalledWith('name');
		});
	});
	
	describe('ctrl.getConfigs with no sort value', function(){
		beforeEach(function(){
			ctrl.sortValue = null;
			ctrl.pageSize = 5;
			ctrl.page = 0;
			ctrl.totalDisplayed = 0;
			ctrl.totalConfigs = 0;
			ctrl.configs = null;
			$httpBackend.expectGET('/configs?page=1&pagesize=5&sortby=name&sortorder=asc').respond(responseNoSort);
			ctrl.getConfigs(null);
		});
		
		it('should set the sort value and pageSize', function(){
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			expect(ctrl.sortValue).toBe(null); 
			expect(ctrl.totalDisplayed).toBe(ctrl.pageSize); 
			expect(ctrl.page).toBe(1); 
			expect(ctrl.totalConfigs).toBe(7); 
			expect(ctrl.configs.length).toEqual(1);
		});
	});
	
	describe('ctrl.getConfigs with a sort value', function(){
		beforeEach(function(){
			ctrl.sortValue = null;
			ctrl.pageSize = 5;
			ctrl.page = 0;
			ctrl.totalDisplayed = 0;
			ctrl.totalConfigs = 0;
			ctrl.configs = null;
			ctrl.sortOrder = 'asc';
			$httpBackend.expectGET('/configs?page=1&pagesize=5&sortby=name&sortorder=asc').respond(responseSort);
			ctrl.getConfigs('name');
		});
		
		it('should set the sort value and pageSize', function(){
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			expect(ctrl.sortBy).toBe('name'); 
			expect(ctrl.totalDisplayed).toBe(ctrl.pageSize); 
			expect(ctrl.page).toBe(1); 
			expect(ctrl.totalConfigs).toBe(23); 
			expect(ctrl.configs.length).toEqual(1);
		});
	});
	
	describe('ctrl.getConfigs with http 401 Unauthorized', function () {
		beforeEach(function(){
			ctrl.sortValue = null;
			ctrl.pageSize = 5;
			ctrl.page = 0;
			ctrl.totalDisplayed = 0;
			ctrl.totalConfigs = 0;
			ctrl.configs = null;
			$httpBackend.expectGET('/configs?page=1&pagesize=5&sortby=name&sortorder=asc').respond(401);
			ctrl.getConfigs('name');
			
		});
		
		it ('should show error msg', function(){
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
			
			expect($mdToast.showSimple).toHaveBeenCalledWith('Unauthorized user!');
		});
		
	});
	
});