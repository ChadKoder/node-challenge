describe('Router', function (){
	var unitTestMocks = new UnitTestMocks(),
		path = unitTestMocks.path,
		res = unitTestMocks.response,
		fs = unitTestMocks.fileSystem,
		req,
		authRouter = new AuthRouter(),
		responseService = new ResponseService(),
		router = new Router(path, fs, responseService, authRouter);
	
	beforeEach(function() {
		spyOn(authRouter, 'routeGet');
	});
	
	describe('routeGet', function () {
		beforeEach(function() {
			spyOn(router, 'renderFile');
		});
		it ('"/configs" should call auth.routeGet', function(){
			router.routeGet('testFileName', '/configs', res, req, 'text/html');
			expect(authRouter.routeGet).toHaveBeenCalled();
		});
		
		it ('"/validateUser" should call auth.routeGet', function(){
			router.routeGet('testFileName', '/validateUser', res, req, 'text/html');
			expect(authRouter.routeGet).toHaveBeenCalled();
		});
		
		it ('"/user-configurations" should call auth.routeGet', function(){
			router.routeGet('testFileName', '/user-configurations', res, req, 'text/html');
			expect(authRouter.routeGet).toHaveBeenCalled();
		});
		
		it ('"/invalid" should call auth.routeGet', function(){
			router.routeGet('testFileName', '/invalid', res, req, 'text/html');
			expect(authRouter.routeGet).toHaveBeenCalled();
		});
		
		it ('"/" should render index.html', function(){
			router.routeGet('c:/', '/', res, req, 'text/html');
			expect(router.renderFile).toHaveBeenCalledWith(res, 'c:/src/views/index.html', 'text/html');			
		});
	});

	it('loadDependencies should render the file provided', function () {
		spyOn(router, 'renderFile');
		router.loadDependencies(res, 'fileName', 'text/html');
		expect(router.renderFile).toHaveBeenCalledWith(res, 'fileName', 'text/html');
	});
	
	it ('renderFile should call fileSystem.readFile', function() {
		router = new Router(path, fs, responseService, authRouter);
		router.renderFile(res, 'fileName2', 'text/html');
		expect(fs.readFile).toHaveBeenCalled();
	});
});	
