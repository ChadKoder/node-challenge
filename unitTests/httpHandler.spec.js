describe('httpHandler', function(){
	var responseService = new ResponseService(),
	router = new Router(),
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
			//spyOn(router, 'loadDependencies');
			spyOn(router, 'get');
		});
		
		it('should call router.get when route is not node_modules or src', function () {
			req = unitTestMocks.request(null, 'src');
			httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, responseService);
		
			httpHandler.handleGetRequest(unitTestMocks.response, req, 'application/json');
			//expect(router.loadDependencies).not.toHaveBeenCalled();
			expect(router.get).toHaveBeenCalledWith('C:/', unitTestMocks.response, req, 'application/json');
		});
	});
	
	describe('handlePostRequest', function() {
		it ('should call router.post', function () {
			spyOn(router, 'post');
			req = unitTestMocks.request(null, 'src');
			httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, responseService);
			
			httpHandler.handlePostRequest(unitTestMocks.response, req, 'application/json');
			
			expect(router.post).toHaveBeenCalled();
		});
	});
	
	describe('handlePutRequest', function() {
		it ('should call router.put', function () {
			req = unitTestMocks.request(null, 'configs');
			httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, responseService);
			
			spyOn(router, 'put');
			
			httpHandler.handlePutRequest(unitTestMocks.response, req, 'application/json');
			
			expect(router.put).toHaveBeenCalled();
		});
	});

	describe('handleDeleteRequest', function() {
		it ('should call router.delete', function () {
			req = unitTestMocks.request(null, 'configs');
			httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, responseService);
			
			spyOn(router, 'delete');
			
			httpHandler.handleDeleteRequest(unitTestMocks.response, req, 'application/json');
			
			expect(router.delete).toHaveBeenCalled();
		});
	});
	
	
});