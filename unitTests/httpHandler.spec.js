describe('httpHandler', function(){
	var fileSystem,
	httpHandler,
	auth,
	router,
	authRouter,
	path = { join: function (a, b) { return a + b; } },
	workingDir = "C:\\",
	configPgObjCreator,
	res = {},
	req,
	responseService,
		users = {
			"users": [{
					"username": "user1",
					"password": "pass1"
				}]
		},
	userConfigs = {
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
	
	res.write = function() {};
	res.writeHead = function() {};
	res.end = function() {};
	
	responseService = new ResponseService();
	router = new Router();
	authRouter = new AuthRouter();
	auth = new Authentication();
	sorter = new Sorter();
	paginator = new Paginator();

	describe('handleGetRequest', function (){
		beforeEach(function(){
			spyOn(router, 'loadDependencies');
			spyOn(router, 'routeGet');
		});
		
		it ('should call router.loadDependencies to render node_modules', function(){			
			url = { parse: function (a) { return { pathname: 'node_modules' }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			req = { url: 'node_modules/' };
			httpHandler.handleGetRequest(res, req, 'application/json');
			expect(router.loadDependencies).toHaveBeenCalled();
			expect(router.routeGet).not.toHaveBeenCalled();
		}); 
		
		it ('should call router.loadDependencies to render src', function () {
			url = { parse: function (a) { return { pathname: 'src' }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			req = { url: 'src/' };
			httpHandler.handleGetRequest(res, req, 'application/json');
			expect(router.loadDependencies).toHaveBeenCalled();
			expect(router.routeGet).not.toHaveBeenCalled();
		});
		
		it('should call router.routeGet when route is not node_modules or src', function () {
			url = { parse: function (a) { return { pathname: 'configs' }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			req = { url: 'configs/' };
			httpHandler.handleGetRequest(res, req, 'application/json');
			expect(router.loadDependencies).not.toHaveBeenCalled();
			expect(router.routeGet).toHaveBeenCalled();
			
			url = { parse: function (a) { return { pathname: 'anything' }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			req = { url: 'anything/' };
			httpHandler.handleGetRequest(res, req, 'application/json');
			expect(router.loadDependencies).not.toHaveBeenCalled();
			expect(router.routeGet).toHaveBeenCalled();
		});
	});
	

	
	
});