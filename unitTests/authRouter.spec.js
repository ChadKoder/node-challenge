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
		url = unitTestMocks.url, 
		Buffer = function (auth, type) {
			return 'user:pass';
		};
	
	beforeEach(function() {
		authRouter = new AuthRouter(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs, Buffer);
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
				var req = {};
				req.headers = {};
				req.headers['authorization'] = 'Basic SGVsbG8gV29ybGQ=';
				req.url = '/validateUser';
				
				spyOn(responseService, 'write401Unauthorized');
				spyOn(auth, 'validateUser').and.returnValue(true);
				spyOn(responseService, 'write200Success');
				
				authRouter.routeGet('fName', '/validateUser', unitTestMocks.response, req, 'contentType');
				
				expect(auth.validateUser).toHaveBeenCalled();
				expect(responseService.write200Success).toHaveBeenCalled();
			});
		});
	});
});