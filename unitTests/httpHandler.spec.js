describe('httpHandler', function(){
	var responseService = new ResponseService(),
	router = new Router(),
	authRouter = new AuthRouter(),
	auth = new Authentication(),
	sorter = new Sorter(),
	paginator = new Paginator(),
	unitTestMocks = new UnitTestMocks(),
	unitTestData = new UnitTestData(),
	userConfigs = unitTestData.userConfigs,
	users = unitTestData.users,
	fileSystem,
	httpHandler,
	workingDir = "C:\\",
	req,
	responseService;
	 
	 
	describe('handleGetRequest', function (){
		beforeEach(function(){
			spyOn(router, 'loadDependencies');
			spyOn(router, 'routeGet');
		});
			
		it ('should call router.loadDependencies to render node_modules', function(){
			req = unitTestMocks.request(null, 'node_modules');
			httpHandler = new HttpHandler(unitTestMocks.path, unitTestMocks.url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			httpHandler.handleGetRequest(unitTestMocks.response, req, 'application/json');
			expect(router.loadDependencies).toHaveBeenCalledWith(unitTestMocks.response, 'C:\\node_modules', 'application/json');
			expect(router.routeGet).not.toHaveBeenCalled();
		}); 
		
		it ('should call router.loadDependencies to render src', function () {
			httpHandler = new HttpHandler(unitTestMocks.path, unitTestMocks.url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			req = unitTestMocks.request(null, 'src');
			httpHandler.handleGetRequest(unitTestMocks.response, req, 'application/json');
			expect(router.loadDependencies).toHaveBeenCalledWith(unitTestMocks.response, 'C:\\src', 'application/json');
			expect(router.routeGet).not.toHaveBeenCalled();
		});
		
		it('should call router.routeGet when route is not node_modules or src', function () {
			req = unitTestMocks.request(null, 'configs');
			httpHandler = new HttpHandler(unitTestMocks.path, unitTestMocks.url, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			httpHandler.handleGetRequest(unitTestMocks.response, req, 'application/json');
			expect(router.loadDependencies).not.toHaveBeenCalled();
			expect(router.routeGet).toHaveBeenCalledWith('C:\\configs', 'configs', unitTestMocks.response, req, 'application/json');
		});
	});
	
	describe('handlePostRequest', function() {
		it ('should call authRouter.routePost', function () {
			//url = { parse: function (a) { return { pathname: 'src' }; } }
			req = unitTestMocks.request(null, 'src');
			httpHandler = new HttpHandler(unitTestMocks.path, unitTestMocks.url, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routePost');
			//req = { url: 'configs/' };
			
			httpHandler.handlePostRequest(unitTestMocks.response, req, 'application/json');
			
			expect(authRouter.routePost).toHaveBeenCalled();
		});
	});
	
	describe('handlePutRequest', function() {
		it ('should call authRouter.routePut', function () {
			//url = { parse: function (a) { return { pathname: 'src' }; } };
			req = unitTestMocks.request(null, 'configs');
			httpHandler = new HttpHandler(unitTestMocks.path, unitTestMocks.url, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routePut');
			//req = { url: 'configs/' };
			
			httpHandler.handlePutRequest(unitTestMocks.response, req, 'application/json');
			
			expect(authRouter.routePut).toHaveBeenCalled();
		});
	});

	describe('handleDeleteRequest', function() {
		it ('should call authRouter.routeDelete', function () {
			//url = { parse: function (a, b) { return { query: { id: '' } }; } };
			req = unitTestMocks.request(null, 'configs');
			httpHandler = new HttpHandler(unitTestMocks.path, unitTestMocks.url, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routeDelete');
			//req = { url: 'configs/' };
			
			httpHandler.handleDeleteRequest(unitTestMocks.response, req, 'application/json');
			
			expect(authRouter.routeDelete).toHaveBeenCalled();
		});
	});
	
	
});