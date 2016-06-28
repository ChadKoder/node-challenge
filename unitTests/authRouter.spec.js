describe('AuthRouter', function (){
	var authRouter,
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
				
				authRouter = new AuthRouter(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs, Buffer);
			});
			
			it('with successful user validation should return 200 success', function() {
				var header = { header: 'authorization', value: 'Basic SGVsbG8gV29ybGQ=' };
				var request = unitTestMocks.request([header], '/validateUser');
				
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
				
				authRouter = new AuthRouter(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs, Buffer);
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
	
	it('routeGet /user-configurations should render the user configurations html', function() {
		spyOn(authRouter, 'renderFile');
		authRouter.routeGet('fName', unitTestMocks.response, unitTestMocks.request(null, '/user-configurations'), 'contentType');
		expect(authRouter.renderFile).toHaveBeenCalledWith(unitTestMocks.response, 'c:/src/views/user-configurations.html', 'contentType');
	});
	
	it('routeGet /configs should call configPageOjbCreator.getSortedPageObj', function() {
		var returnVal = { val: 'myObject' };
		spyOn(configPageObjCreator, 'getSortedPageObj').and.returnValue(returnVal);
		authRouter.routeGet('fName',  unitTestMocks.response, unitTestMocks.request(null, '/configs'), 'contentType');
		expect(configPageObjCreator.getSortedPageObj).toHaveBeenCalled();
		expect(unitTestMocks.response.setHeader).toHaveBeenCalled();
		expect(unitTestMocks.response.write).toHaveBeenCalledWith(JSON.stringify(returnVal));
		expect(unitTestMocks.response.end).toHaveBeenCalled();
	});
	
	it('routeGet /invalidUri should call responseService.write404NotFound', function() {
		spyOn(responseService, 'write404NotFound');
		authRouter.routeGet('fName',  unitTestMocks.response, unitTestMocks.request(null, '/invalidUri'), 'contentType');
		expect(responseService.write404NotFound).toHaveBeenCalled();
	});

	it('routePost /logout should set token to null and call responseService.write204NoContent', function() {
		spyOn(responseService, 'write204NoContent');
		authRouter.routePost('fName',  unitTestMocks.response, unitTestMocks.request(null, '/logout'), 'contentType');
		expect(responseService.write204NoContent).toHaveBeenCalled();
	});
	
	describe('routePost /configs', function() {
		it ('should call responseService.write401Unauthorized when authentication fails', function(){
			spyOn(auth, 'isAuthorized').and.returnValue(false);
			spyOn(responseService, 'write401Unauthorized');
			var req = unitTestMocks.request(null, '/configs');
			authRouter.routePost('fName',  unitTestMocks.response, req, 'contentType');
			
			expect(responseService.write401Unauthorized).toHaveBeenCalled();
			
		});
		
		it ('should call ???????????', function(){
			var req = unitTestMocks.request(null, '/configs');
			spyOn(auth, 'isAuthorized').and.returnValue(true);
			spyOn(responseService, 'write204NoContent');
			spyOn(req, 'on');
			authRouter.routePost('fName', unitTestMocks.response, req, 'contentType');
			expect(req.on).toHaveBeenCalled();
			//expect(responseService.write204NoContent).toHaveBeenCalled();
			
		});
	});
});