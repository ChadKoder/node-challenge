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
		describe('when uri is /ValidateUser', function(){
			it('no authorization header should return 401 Unauthorized', function(){
				spyOn(responseService, 'write401Unauthorized');
				spyOn(auth, 'validateUser');
				authRouter.routeGet('fName', '/validateUser', unitTestMocks.response, unitTestMocks.request(null, '/validateUser'), 'contentType');
				expect(auth.validateUser).not.toHaveBeenCalled();
				expect(responseService.write401Unauthorized).toHaveBeenCalled();
			});
			
			it('valid authorization header should return 200 success', function() {
				var req = {};
				req.headers = {};
				req.headers['authorization'] = 'Basic SGVsbG8gV29ybGQ=';
				req.url = '/validateUser';
				
				spyOn(auth, 'validateUser').and.returnValue(true);
				spyOn(responseService, 'write200Success');
				
				authRouter.routeGet('fName', '/validateUser', unitTestMocks.response, req, 'contentType');
				
				expect(auth.validateUser).toHaveBeenCalled();
				expect(responseService.write200Success).toHaveBeenCalled();
			});
		});
		
	});
});