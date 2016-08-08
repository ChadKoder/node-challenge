describe ('Sorter', function (){
	var unitTestData = new UnitTestData(),
		userConfigs = unitTestData.userConfigs,
		sorter = new Sorter(unitTestData.userConfigs);
		
	describe('sortByHostNameAsc', function(){
		it('should sort by host name ascending', function (){
			sorter.sortByHostNameAsc();
			expect(userConfigs.configurations[0].hostname).toBe('aaa');
			expect(userConfigs.configurations[1].hostname).toBe('ggg');
			expect(userConfigs.configurations[2].hostname).toBe('zzz');
		});
	});
	
	describe('sortByUserNameAsc', function(){
		it('should sort by user name ascending', function (){
			sorter.sortByUserNameAsc();
			expect(userConfigs.configurations[0].username).toBe('bname');
			expect(userConfigs.configurations[1].username).toBe('uname');
			expect(userConfigs.configurations[2].username).toBe('zname');
		});
	});
	
	describe('sortByPortAsc', function(){
		it('should sort by port ascending', function (){
			sorter.sortByPortAsc();
			expect(userConfigs.configurations[0].port).toBe(1234);
			expect(userConfigs.configurations[1].port).toBe(1235);
			expect(userConfigs.configurations[2].port).toBe(7777);
		});
	});
	
	describe('sortByNameAsc', function(){
		it('should sort by name ascending', function (){
			sorter.sortByNameAsc();
			expect(userConfigs.configurations[0].name).toBe('anthony');
			expect(userConfigs.configurations[1].name).toBe('john');
			expect(userConfigs.configurations[2].name).toBe('zack');
		});
	});
	
	describe('getSortDesc', function(){
		beforeEach(function(){
			spyOn(sorter, 'sortByHostNameDesc');
			spyOn(sorter, 'sortByPortDesc');
			spyOn(sorter, 'sortByUserNameDesc');
			spyOn(sorter, 'sortByNameDesc');
		});
				
		it('should call sortByHostNameAsc when sortBy = "hostname"', function (){
			sorter.getSortDesc('hostname');
			expect(sorter.sortByHostNameDesc).toHaveBeenCalled();
		});
		
		it('should call sortByPortAsc when sortBy = "port"', function (){
			sorter.getSortDesc('port');
			expect(sorter.sortByPortDesc).toHaveBeenCalled();
		});
		
		it('should call sortByUserNameAsc when sortBy = "username"', function (){
			sorter.getSortDesc('username');
			expect(sorter.sortByUserNameDesc).toHaveBeenCalled();
		});
		
		it('should call sortByUserNameAsc when no sortBy is defined', function (){
			sorter.getSortDesc(null);
			expect(sorter.sortByNameDesc).toHaveBeenCalled();
		});
		
		it('sortBy parameter should not be case sensitive', function (){
			sorter.getSortDesc('NaMe');
			expect(sorter.sortByNameDesc).toHaveBeenCalled();
		});
	});
	
	describe('getSortAsc', function(){
		beforeEach(function(){
			spyOn(sorter, 'sortByHostNameAsc');
			spyOn(sorter, 'sortByPortAsc');
			spyOn(sorter, 'sortByUserNameAsc');
			spyOn(sorter, 'sortByNameAsc');
		});
				
		it('should call sortByHostNameAsc when sortBy = "hostname"', function (){
			sorter.getSortAsc('hostname');
			expect(sorter.sortByHostNameAsc).toHaveBeenCalled();
		});
		
		it('should call sortByPortAsc when sortBy = "port"', function (){
			sorter.getSortAsc('port');
			expect(sorter.sortByPortAsc).toHaveBeenCalled();
		});
		
		it('should call sortByUserNameAsc when sortBy = "username"', function (){
			sorter.getSortAsc('username');
			expect(sorter.sortByUserNameAsc).toHaveBeenCalled();
		});
		
		it('should call sortByUserNameAsc when no sortBy is defined', function (){
			sorter.getSortAsc(null);
			expect(sorter.sortByNameAsc).toHaveBeenCalled();
		});
		
		it('sortBy parameter should not be case sensitive', function (){
			sorter.getSortAsc('NaMe');
			expect(sorter.sortByNameAsc).toHaveBeenCalled();
		});
	});
	
	describe('sortByNameDesc', function(){
		it('should sort by name descending', function (){
			sorter.sortByNameDesc();
			expect(userConfigs.configurations[0].name).toBe('zack');
			expect(userConfigs.configurations[1].name).toBe('john');
			expect(userConfigs.configurations[2].name).toBe('anthony');
		});
	});
	
	describe('sortByHostNameDesc', function(){
		it('should sort by host name descending', function (){
			sorter.sortByHostNameDesc();
			expect(userConfigs.configurations[0].hostname).toBe('zzz');
			expect(userConfigs.configurations[1].hostname).toBe('ggg');
			expect(userConfigs.configurations[2].hostname).toBe('aaa');
		});
	});
	
	describe('sortByPortDesc', function(){
		it('should sort by port descending', function (){
			sorter.sortByPortDesc();
			expect(userConfigs.configurations[0].port).toBe(7777);
			expect(userConfigs.configurations[1].port).toBe(1235);
			expect(userConfigs.configurations[2].port).toBe(1234);
		});
	});
	
	 
});
