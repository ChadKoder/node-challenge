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
	 
  
	it('handleGetRequest should call router.get when route is not node_modules or src', function () {
		spyOn(router, 'get');
		req = unitTestMocks.request(null, 'anything');
		httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, responseService);
	
		httpHandler.handleGetRequest(unitTestMocks.response, req, 'application/json');
		expect(router.get).toHaveBeenCalledWith(unitTestMocks.response, req, 'application/json');
	}); 
	 
	it ('handlePostRequest should call router.post', function () {
		spyOn(router, 'post');
		req = unitTestMocks.request(null, 'src');
		httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, responseService);
		
		httpHandler.handlePostRequest(unitTestMocks.response, req, 'application/json');
		
		expect(router.post).toHaveBeenCalled();
	}); 
 
	it ('handlePutRequest should call router.put', function () {
		req = unitTestMocks.request(null, 'configs');
		httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, responseService);
		
		spyOn(router, 'put');
		
		httpHandler.handlePutRequest(unitTestMocks.response, req, 'application/json');
		
		expect(router.put).toHaveBeenCalled();
	});
	  
	it ('handleDeleteRequest should call router.delete', function () {
		req = unitTestMocks.request(null, 'configs');
		httpHandler = new HttpHandler(unitTestMocks.path, workingDir, userConfigs, auth, router, responseService);
		
		spyOn(router, 'delete');
		
		httpHandler.handleDeleteRequest(unitTestMocks.response, req, 'application/json');
		
		expect(router.delete).toHaveBeenCalled();
	}); 
});