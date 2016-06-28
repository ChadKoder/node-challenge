describe('Router', function (){
	var unitTestMocks = new UnitTestMocks(),
		path = unitTestMocks.path,
		res = unitTestMocks.response,
		fs = unitTestMocks.fileSystem,
		req,
		authRouter = new AuthRouter(),
		responseService = new ResponseService(),
		url = unitTestMocks.url, 
		router = new Router(path, fs, responseService, authRouter, url);
	
	beforeEach(function() {
		spyOn(authRouter, 'routeGet');
	});
	
	describe('routeGet', function () {
		beforeEach(function() {
			spyOn(router, 'renderFile');
		});
	
		it('"node_modules" should call router.loadDependencies', function() {
			spyOn(router, 'loadDependencies');
			req = unitTestMocks.request(null, 'node_modules');
			router.routeGet('fName', res, req, 'contentType');
			expect(router.loadDependencies).toHaveBeenCalled();
		});
		
		it('"src" should call router.loadDependencies', function() {
			spyOn(router, 'loadDependencies');
			req = unitTestMocks.request(null, 'src');
			router.routeGet('fName', res, req, 'contentType');
			expect(router.loadDependencies).toHaveBeenCalled();
		});
		
		it ('"/configs" should call auth.routeGet', function(){
			req = unitTestMocks.request(null, '/configs');
			router.routeGet('dir', res, req, 'text/html');
			expect(authRouter.routeGet).toHaveBeenCalled();
		});
		
		it ('"/validateUser" should call auth.routeGet', function(){
			req = unitTestMocks.request(null, 'validateUser');
			router.routeGet('dir', res, req, 'contentType');
			expect(authRouter.routeGet).toHaveBeenCalled();
		});
		
		it ('"/user-configurations" should call auth.routeGet', function(){
			req = unitTestMocks.request(null, '/user-configurations');
			router.routeGet('dir', res, req, 'contentType');
			expect(authRouter.routeGet).toHaveBeenCalled();
		});
		
		it ('"/invalid" should call auth.routeGet', function(){
			req = unitTestMocks.request(null, '/invalid');
			router.routeGet('testFileName', res, req, 'contentType');
			expect(authRouter.routeGet).toHaveBeenCalled();
		});
		
		it ('"/" should render index.html', function(){
			req = unitTestMocks.request(null, '/');
			router.routeGet('c:', res, req, 'text/html');
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
