describe('Router', function (){
	var router, path, responseService, authRouter, 
	res = {}, req = {}, 
	path = { join: function(a, b) { return a + '/' + b; } },
	fs = { readFile: jasmine.createSpy('fs.readFile') };
	
	beforeEach(function() {
		responseService = new ResponseService();
		authRouter = new AuthRouter();
		spyOn(authRouter, 'routeGet');
		router = new Router(path, fs, responseService, authRouter);
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
