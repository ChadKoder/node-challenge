describe('httpHandler', function(){
	var responseService = new ResponseService(),
	router = new Router(),
	unitTestMocks = new UnitTestMocks(),
	unitTestData = new UnitTestData(),
	fileSystem,
	httpHandler,
	workingDir = "C:/",
	req,
	responseService;
	 
	 beforeEach(function() {
		spyOn(responseService, 'write405MethodNotAllowed'); 
	 });
  
	it('handleGetRequest should call router.get when route is not node_modules or src', function () {
		 
		req = unitTestMocks.request(null, 'anything');
		httpHandler = new HttpHandler(unitTestMocks.path, workingDir,  router, responseService);
	
		httpHandler.handleGetRequest(unitTestMocks.response, req, 'application/json');
		expect(responseService.write405MethodNotAllowed).toHaveBeenCalled();
	}); 
	 
	it ('handlePostRequest should call router.post', function () {
		spyOn(router, 'post');
		req = unitTestMocks.request(null, 'any');
		httpHandler = new HttpHandler(unitTestMocks.path, workingDir,  router, responseService);
		httpHandler.handlePostRequest(unitTestMocks.response, req, 'application/json');
		
		expect(router.post).toHaveBeenCalled();
	}); 
 
	it ('handlePutRequest should call responseService.write405MethodNotAllowed', function () {
		req = unitTestMocks.request(null, 'any');
		httpHandler = new HttpHandler(unitTestMocks.path, workingDir,  router, responseService);
		httpHandler.handlePutRequest(unitTestMocks.response, req, 'application/json');
		
		expect(responseService.write405MethodNotAllowed).toHaveBeenCalled();
	});
	  
	it ('handleDeleteRequest should call responseService.write405MethodNotAllowed', function () {
		req = unitTestMocks.request(null, 'any');
		httpHandler = new HttpHandler(unitTestMocks.path, workingDir, router, responseService);
		httpHandler.handleDeleteRequest(unitTestMocks.response, req, 'application/json');
		
		expect(responseService.write405MethodNotAllowed).toHaveBeenCalled();
	}); 
});