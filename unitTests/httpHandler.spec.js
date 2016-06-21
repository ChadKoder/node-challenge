describe('httpHandler', function(){
	var fileSystem,
	httpHandler,
	auth,
	router,
	authRouter,
	path = { join: function (a, b) { return a + b; } },
	workingDir = "C:\\",
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
			expect(router.loadDependencies).toHaveBeenCalledWith(res, 'C:\\node_modules', 'application/json');
			expect(router.routeGet).not.toHaveBeenCalled();
		}); 
		
		it ('should call router.loadDependencies to render src', function () {
			url = { parse: function (a) { return { pathname: 'src' }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			req = { url: 'src/' };
			httpHandler.handleGetRequest(res, req, 'application/json');
			expect(router.loadDependencies).toHaveBeenCalledWith(res, 'C:\\src', 'application/json');
			expect(router.routeGet).not.toHaveBeenCalled();
		});
		
		it('should call router.routeGet when route is not node_modules or src', function () {
			url = { parse: function (a) { return { pathname: 'configs' }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			req = { url: 'configs/' };
			httpHandler.handleGetRequest(res, req, 'application/json');
			expect(router.loadDependencies).not.toHaveBeenCalled();
			expect(router.routeGet).toHaveBeenCalledWith('C:\\configs', 'configs', res, req, 'application/json');
		});
	});
	
	describe('handlePostRequest', function() {
		it ('should call authRouter.routePost', function () {
			url = { parse: function (a) { return { pathname: 'src' }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routePost');
			req = { url: 'configs/' };
			
			httpHandler.handlePostRequest(res, req, 'application/json');
			
			expect(authRouter.routePost).toHaveBeenCalled();
		});
	});
	
	describe('handlePutRequest', function() {
		it ('should call authRouter.routePut', function () {
			url = { parse: function (a) { return { pathname: 'src' }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routePut');
			req = { url: 'configs/' };
			
			httpHandler.handlePutRequest(res, req, 'application/json');
			
			expect(authRouter.routePut).toHaveBeenCalled();
		});
	});

	describe('handleDeleteRequest', function() {
		it ('should call authRouter.routeDelete', function () {
			url = { parse: function (a, b) { return { query: { id: '' } }; } };
			httpHandler = new HttpHandler(path, url, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routeDelete');
			req = { url: 'configs/' };
			
			httpHandler.handleDeleteRequest(res, req, 'application/json');
			
			expect(authRouter.routeDelete).toHaveBeenCalled();
		});
	});
	
	
});