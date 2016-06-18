describe('AuthRouter', function (){
	var authRouter, path, responseService, 
	currentWorkingDir = 'c:\\',
	configPageObjCreator, auth,
	res = { write: function () {}, writeHead: function () {}, end: function() {} }, req = { headers: []},  url  = '',
	path = { join: function(a, b) { return a + '/' + b; } };
	var c = function (err, file) { if (err) { return 'error'; } return 'noError' ; };
	var fs = { readFile: function(a, b, readFileError) { return; } };
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
	
	beforeEach(function() {
		responseService = new ResponseService();
		configPageObjCreator = new ConfigPageObjCreator();
		auth = new Authentication();
		authRouter = new AuthRouter(path, fs, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs);
	});
	
	describe('routeGet', function() {
		describe('when uri is /validateUser and no authorization header is provided', function () {
			it('should return 401 Unauthorized', function() {
				spyOn(responseService, 'write401Unauthorized');
				spyOn(auth, 'validateUser');
				authRouter.routeGet('fName', '/validateUser', res, req, 'contentType');
				expect(auth.validateUser).not.toHaveBeenCalled();
				expect(responseService.write401Unauthorized).toHaveBeenCalled();
			});
		});
		
		/*describe('when uri is /validateUser with authorization header', function () {
			it('should call authentication.validateUser', function() {
				spyOn(auth, 'validateUser');
				req.headers['authorization'] = 'Basic hash';
				
				
				authRouter.routeGet('fName', '/validateUser', res, req, 'contentType');
				expect(auth.validateUser).toHaveBeenCalled();
			});
		});*/
	});
});