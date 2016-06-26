describe('AuthRouter', function (){
	var authRouter,
		responseService = new ResponseService(),
		unitTestMocks = new UnitTestMocks(),
		configPageObjCreator = new ConfigPageObjCreator(),
		unitTestData = new UnitTestData(),
		auth = new Authentication(),
		path = unitTestMocks.path,
		currentWorkingDir = 'c:\\',
		userConfigs = unitTestData.userConfigs,
		url = unitTestMocks.url;
	
	beforeEach(function() {
		authRouter = new AuthRouter(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs);
	});
	
	describe('routeGet', function() {
		describe('when uri is /validateUser and no authorization header is provided', function () {
			it('should return 401 Unauthorized', function() {
				spyOn(responseService, 'write401Unauthorized');
				spyOn(auth, 'validateUser');
				authRouter.routeGet('fName', '/validateUser', unitTestMocks.response, unitTestMocks.request(null, '/validateUser'), 'contentType');
				expect(auth.validateUser).not.toHaveBeenCalled();
				expect(responseService.write401Unauthorized).toHaveBeenCalled();
			});
		});
		
		describe('when uri is /validateUser and an authorization header is provided', function () {
			it('should return 401 Unauthorized', function() {
				//var authHeader = [{'authorization': 'Basic 123'}];
				var authHeader = {
					'authorization': ['Basic 123']
				};
				spyOn(responseService, 'write401Unauthorized');
				spyOn(auth, 'validateUser').and.returnValue(true);
				authRouter.routeGet('fName', '/validateUser', unitTestMocks.response, unitTestMocks.request(authHeader, '/validateUser'), 'contentType');
				expect(auth.validateUser).toHaveBeenCalled();
				// f expect(responseService.write401Unauthorized).toHaveBeenCalled();
			});
		});
	});
});