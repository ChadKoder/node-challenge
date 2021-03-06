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
	workingDir = "C:/",
	req,
	responseService;
	 
	 
	describe('handleGetRequest', function (){
		beforeEach(function(){
			spyOn(router, 'loadDependencies');
			spyOn(router, 'routeGet');
		});
		
		it('should call router.routeGet when route is not node_modules or src', function () {
			req = unitTestMocks.request(null, 'src');
			httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, authRouter, responseService);
		
			httpHandler.handleGetRequest(unitTestMocks.response, req, 'application/json');
			expect(router.loadDependencies).not.toHaveBeenCalled();
			expect(router.routeGet).toHaveBeenCalledWith('C:/', unitTestMocks.response, req, 'application/json');
		});
	});
	
	describe('handlePostRequest', function() {
		it ('should call authRouter.routePost', function () {
			req = unitTestMocks.request(null, 'src');
			httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routePost');
			
			httpHandler.handlePostRequest(unitTestMocks.response, req, 'application/json');
			
			expect(authRouter.routePost).toHaveBeenCalled();
		});
	});
	
	describe('handlePutRequest', function() {
		it ('should call authRouter.routePut', function () {
			req = unitTestMocks.request(null, 'configs');
			httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routePut');
			
			httpHandler.handlePutRequest(unitTestMocks.response, req, 'application/json');
			
			expect(authRouter.routePut).toHaveBeenCalled();
		});
	});

	describe('handleDeleteRequest', function() {
		it ('should call authRouter.routeDelete', function () {
			req = unitTestMocks.request(null, 'configs');
			httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, authRouter, responseService);
			
			spyOn(authRouter, 'routeDelete');
			
			httpHandler.handleDeleteRequest(unitTestMocks.response, req, 'application/json');
			
			expect(authRouter.routeDelete).toHaveBeenCalled();
		});
	});
	
	
});