describe('AuthRouter', function (){
	var authRouter, path, responseService, 
	currentWorkingDir = 'c:\',
	configPageObjCreator, auth,
	res = {}, req = {},  url  = '',
	path = { join: function(a, b) { return a + '/' + b; } };
	var c = function (err, file) { if (err) { return 'error'; } return 'noError' ; };
	var fs = { readFile: function(a, b, readFileError) { return; } };
	
	beforeEach(function() {
		responseService = new ResponseService();
		configPageObjCreator = new ConfigPageObjCreator();
		auth = new Authentication();
		authRouter = new AuthRouter(path, fs, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs);
	});
	
	describe('routeGet', function() {
		describe('when uri is /validateUser and no authorization header is provided', function () {
			it('should return 401 Unauthorized', function() {
				authRouter.routeGet('fName', '/validateUser', res, req, 'contentType');
			});
		});
	});
});