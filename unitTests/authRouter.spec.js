describe('AuthRouter', function (){
	var authRouter = new AuthRouter(),
		responseService = new ResponseService(),
		unitTestMocks = new UnitTestMocks(),
		configPageObjCreator = new ConfigPageObjCreator(),
		unitTestData = new UnitTestData(),
		auth = new Authentication(),
		path = unitTestMocks.path,
		currentWorkingDir = 'c:/',
		userConfigs = unitTestData.userConfigs,
		url = unitTestMocks.url, 
		Buffer;
	
	describe('routeGet with uri /validateUser', function() {
		describe('when a valid authorization header and credentials are provided', function (){
			beforeEach(function() {
				Buffer = function (auth, type) {
					return {
						toString: function (param) {
							if (param){
								return 'ABC123#';
							} else {
								return 'user:pass';
							}
						}
					}
				};
				
				authRouter.init(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs, Buffer);
			});
			
			it('with successful user validation should return 200 success', function() {
				var header = { header: 'authorization', value: 'Basic SGVsbG8gV29ybGQ=' };
				var request = unitTestMocks.request([header], '/validateUser');
				
				expect(1).toEqual(1);
				
				spyOn(auth, 'validateUser').and.returnValue(true);
				spyOn(responseService, 'write200Success');
				
				authRouter.routeGet('fName', unitTestMocks.response, request, 'contentType');
				
				expect(auth.validateUser).toHaveBeenCalled();
				expect(responseService.write200Success).toHaveBeenCalledWith(unitTestMocks.response, null, 'fName', 'contentType', 'ABC123#');
				
				
				
			});
			
			it('invalid credentials should return 401 Unauthorized', function() {
				var header = { header: 'authorization', value: 'Basic SGVsbG8gV29ybGQ=' };
				var request = unitTestMocks.request([header], '/validateUser');
				
				spyOn(auth, 'validateUser').and.returnValue(false);
				spyOn(responseService, 'write401Unauthorized');
				
				authRouter.routeGet('fName', unitTestMocks.response, request, 'contentType');
				
				expect(auth.validateUser).toHaveBeenCalled();
				expect(responseService.write401Unauthorized).toHaveBeenCalled();
			});
			
			it('routeGet /user-configurations should render the user configurations html', function() {
				spyOn(authRouter, 'renderFile');
				authRouter.routeGet('fName', unitTestMocks.response, unitTestMocks.request(null, '/user-configurations'), 'contentType');
				expect(authRouter.renderFile).toHaveBeenCalledWith(unitTestMocks.response,'./index.html', 'contentType');
			});
	
			it('routeGet /configs should call configPageOjbCreator.getSortedPageObj', function() {
				var returnVal = { val: 'myObject' };
				spyOn(responseService, 'write200OKWithData');
				spyOn(configPageObjCreator, 'getSortedPageObj').and.returnValue(returnVal);
				authRouter.routeGet('fName',  unitTestMocks.response, unitTestMocks.request(null, '/configs'), 'contentType');
				expect(configPageObjCreator.getSortedPageObj).toHaveBeenCalled();
				expect(responseService.write200OKWithData).toHaveBeenCalled(); 
			});
	
			it('routeGet should default to rendering the file', function() {
				spyOn(authRouter, 'renderFile');
				
				authRouter.routeGet('fName',  unitTestMocks.response, unitTestMocks.request(null, '/file.txt'), 'contentType');
				expect(authRouter.renderFile).toHaveBeenCalled();
			});
			
			it('routeGet /configs should call configPageOjbCreator.getSortedPageObj', function() {
				var returnVal = { val: 'myObject' };
				spyOn(responseService, 'write200OKWithData');
				spyOn(configPageObjCreator, 'getSortedPageObj').and.returnValue(returnVal);
				authRouter.routeGet('fName',  unitTestMocks.response, unitTestMocks.request(null, '/configs'), 'contentType');
				expect(configPageObjCreator.getSortedPageObj).toHaveBeenCalled();
				
				expect(responseService.write200OKWithData).toHaveBeenCalled(); 
			});
		});
		
		describe('routeGet with uri /validateUser and a valid authorization header but no credentials', function () {
			beforeEach(function() {
				Buffer = function (auth, type) {
					return {
						toString: function (param) {
							if (param){
								return 'ABC123#';
							} else {
								return undefined;
							}
						}
					}
				};
				
				authRouter = new AuthRouter();
				authRouter.init(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs, Buffer);
			});
			
			it('should return 401 Unauthorized', function(){
				spyOn(responseService, 'write401Unauthorized');
				spyOn(auth, 'validateUser');
				authRouter.routeGet('fName', unitTestMocks.response, unitTestMocks.request(null, '/validateUser'), 'contentType');
				expect(auth.validateUser).not.toHaveBeenCalled();
				expect(responseService.write401Unauthorized).toHaveBeenCalled();
			});
		}); 
	});
			
	describe('routePost', function() {
		beforeEach(function() {
			Buffer = function (auth, type) {
					return {
						toString: function (param) {
							if (param){
								return 'ABC123#';
							} else {
								return 'user:pass';
							}
						}
					}
				};
				
			authRouter = new AuthRouter();
			authRouter.init(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs, Buffer);
		});

it('routePost /logout should set token to null and call responseService.write204NoContent', function() {
			spyOn(responseService, 'write204NoContent');
			authRouter.routePost('fName',  unitTestMocks.response, unitTestMocks.request(null, '/logout'), 'contentType');
			expect(responseService.write204NoContent).toHaveBeenCalled();
		});
		
		it ('/configs should call responseService.write401Unauthorized when authentication fails', function(){
			spyOn(auth, 'isAuthorized').and.returnValue(false);
			spyOn(responseService, 'write401Unauthorized');
			var req = unitTestMocks.request(null, '/configs');
			authRouter.routePost('fName',  unitTestMocks.response, req, 'contentType');
			
			expect(responseService.write401Unauthorized).toHaveBeenCalled();			
		});
		
		it('/configs should add the config if the data exists', function () {
			spyOn(auth, 'isAuthorized').and.returnValue(true);
			spyOn(responseService, 'write204NoContent');
			var header = { header: 'Content-Type', value: 'application/json' };
			var mockAddConfig = {
				config: { 
					username: 'username', 
					name: 'name', 
					port: '1111', 
					hostname: 'hostname' 
					}
				};
			var req = unitTestMocks.request([header], '/configs', mockAddConfig);
			expect(userConfigs.configurations.length).toEqual(3);
			authRouter.routePost('fname', unitTestMocks.response, req, 'application/json');
			expect(unitTestMocks.fileSystem.writeFileSync).toHaveBeenCalled();
			expect(userConfigs.configurations.length).toEqual(4);
			expect(responseService.write204NoContent).toHaveBeenCalled();
		});
		
		it('/configs should call responseService.write400BadRequest if the config data does not exist', function () {
			spyOn(auth, 'isAuthorized').and.returnValue(true);
			spyOn(responseService, 'write400BadRequest');
			var header = { header: 'Content-Type', value: 'application/json' };
			var mockAddConfig;
			var req = unitTestMocks.request([header], '/configs', mockAddConfig);
			authRouter.routePost('fname', unitTestMocks.response, req, 'application/json');
			expect(responseService.write400BadRequest).toHaveBeenCalled();
		});	
		
		it('/invalidUri should call responseService.write404NotFound', function() {
			spyOn(responseService, 'write404NotFound');
			var req = unitTestMocks.request(null, '/invalidUri');
			authRouter.routePost('fname', unitTestMocks.response, req, 'application/json');
			expect(responseService.write404NotFound).toHaveBeenCalled();
		});
	});
		
	describe('routePut', function() {
		beforeEach(function() {
			Buffer = function (auth, type) {
					return {
						toString: function (param) {
							if (param){
								return 'ABC123#';
							} else {
								return 'user:pass';
							}
						}
					}
				};
				
			authRouter = new AuthRouter();
			authRouter.init(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs, Buffer);
		});
		
		describe('when user is unauthorized', function(){
			it('should call responseService.write401Unauthorized', function(){
				var req = unitTestMocks.request(null, '/any');
				spyOn(responseService, 'write401Unauthorized');
				spyOn(auth, 'isAuthorized').and.returnValue(false);
				
				authRouter.routePut('fname', unitTestMocks.response, req, 'contentType');
				expect(responseService.write401Unauthorized).toHaveBeenCalled();
			});
		});
		
		it('/configs with updated config should update configs and call responseService.write204NoContent', function(){			
			spyOn(responseService, 'write204NoContent');
			spyOn(auth, 'isAuthorized').and.returnValue(true);
			var header = { header: 'Content-Type', value: 'application/json' };
			var mockUpdatedConfig = {
				config: { 
					username: 'bname', 
					name: 'chad', 
					port: '1234', 
					hostname: 'hostname' 
					}
				};
			var req = unitTestMocks.request([header], '/configs', mockUpdatedConfig);
			expect(userConfigs.configurations.length).toEqual(4);
			authRouter.routePut('fname', unitTestMocks.response, req, 'application/json');
			expect(unitTestMocks.fileSystem.writeFileSync).toHaveBeenCalled();
			expect(userConfigs.configurations.length).toEqual(4);
			expect(responseService.write204NoContent).toHaveBeenCalled();
			var updatedConfg;
			for (var i = 0; i < userConfigs.configurations.length; i++){
				if (userConfigs.configurations[i].username === 'bname'){
					updatedConfg = userConfigs.configurations[i];
				}
			}
			expect(updatedConfg.port).toBe('1234');
			expect(updatedConfg.hostname).toBe('hostname');
			expect(updatedConfg.name).toBe('chad');
		});
		
		it('/configs should call responseService.write400BadRequest if the config data does not exist', function () {
			spyOn(auth, 'isAuthorized').and.returnValue(true);
			spyOn(responseService, 'write400BadRequest');
			var header = { header: 'Content-Type', value: 'application/json' };
			var mockUpdatedConfig;
			var req = unitTestMocks.request([header], '/configs', mockUpdatedConfig);
			authRouter.routePut('fname', unitTestMocks.response, req, 'application/json');
			expect(responseService.write400BadRequest).toHaveBeenCalled();
		});	
		
		it('/invalidUri should call responseService.write404NotFound', function() {
			spyOn(auth, 'isAuthorized').and.returnValue(true);
			spyOn(responseService, 'write404NotFound');
			var req = unitTestMocks.request(null, '/invalidUri');
			authRouter.routePut('fname', unitTestMocks.response, req, 'application/json');
			expect(responseService.write404NotFound).toHaveBeenCalled();
		});
	});
	
	it('routeDelete /configs should call responseService.write401Unauthorized if authentication fails', function() {
		spyOn(auth, 'isAuthorized').and.returnValue(false);
		spyOn(responseService, 'write401Unauthorized');
		var req = unitTestMocks.request(null, '/configs');
		authRouter.routeDelete('fname', unitTestMocks.response, req, 'application/json');
		expect(responseService.write401Unauthorized).toHaveBeenCalled();
	});
	
	it('routeDelete /configs should delete the configuration if provided and authorized', function(){
		spyOn(auth, 'isAuthorized').and.returnValue(true);
		var header = { header: 'Content-Type', value: 'application/json' };
			var mockDeletedConfig = {
				config: { 
					username: 'bname', 
					name: 'chad', 
					port: '1234', 
					hostname: 'hostname' 
					}
				};
		var req = unitTestMocks.request([header], '/configs', mockDeletedConfig);
		authRouter.routeDelete('fname', unitTestMocks.response, req, 'application/json');
		expect(unitTestMocks.fileSystem.writeFileSync).toHaveBeenCalled();
		expect(userConfigs.configurations.length).toEqual(3);
		
		var deletedConfig;
		for (var i = 0; i < userConfigs.configurations.length; i++){
			if (userConfigs.configurations[i].username === 'bname'){
				deletedConfig = userConfigs.configurations[i];
			}
		}
		
		expect(deletedConfig).toBeFalsy();
		expect(unitTestMocks.response.writeHeader).toHaveBeenCalledWith(204);
		expect(unitTestMocks.response.end).toHaveBeenCalled();
	});
	
	it('routeDelete /invalidUri should call responseService.write404NotFound', function() {
			spyOn(auth, 'isAuthorized').and.returnValue(true);
			spyOn(responseService, 'write404NotFound');
			var req = unitTestMocks.request(null, '/invalidUri');
			authRouter.routeDelete('fname', unitTestMocks.response, req, 'application/json');
			expect(responseService.write404NotFound).toHaveBeenCalled();
	});
	
	describe('renderFile', function() {
		it('should call responseService.write500InternalError when readfile throws error', function() {
			spyOn(unitTestMocks.fileSystem, 'readFile');
			unitTestMocks.fileSystem.setFileReadError(true);
			authRouter.renderFile(unitTestMocks.response, 'fname', 'contentType');
			expect(unitTestMocks.fileSystem.readFile).toHaveBeenCalled();
		});
		
		it('should call responseService.write200Success when readfile has no error', function() {
			spyOn(responseService, 'write200Success');
			unitTestMocks.fileSystem.setFileReadError(false);
			authRouter.renderFile(unitTestMocks.response, 'fname', 'contentType');
			
			expect(responseService.write200Success).toHaveBeenCalled();
		});
	});
	
	
	
});

	
