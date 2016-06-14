describe ('Sorter', function (){
	var userConfigs = {
		"configurations": [{
				"name": "zack",
				"hostname": "aaa",
				"port": 7777,
				"username": "bname"
			},
			{
				"name": "anthony",
				"hostname": "zzz",
				"port": 1234,
				"username": "zname"
			},
			{
				"name": "john",
				"hostname": "ggg",
				"port": 1235,
				"username": "uname"
			}]
	};
	
	beforeEach(function(){
		module('Sorter');
	});
	
	describe('sortByHostNameAsc', function(){
		it('should sort by host name ascending', function (){
			var sorter = new Sorter(userConfigs);
			sorter.sortByHostNameAsc();
			expect(userConfigs.configurations[0].hostname).toBe('aaa');
			expect(userConfigs.configurations[1].hostname).toBe('ggg');
			expect(userConfigs.configurations[2].hostname).toBe('zzz');
		});
	});
	
	describe('sortByNameDesc', function(){
		it('should sort by name descending', function (){
			var sorter = new Sorter(userConfigs);
			sorter.sortByNameDesc();
			expect(userConfigs.configurations[0].name).toBe('zack');
			expect(userConfigs.configurations[1].name).toBe('john');
			expect(userConfigs.configurations[2].name).toBe('anthony');
		});
	});
});
