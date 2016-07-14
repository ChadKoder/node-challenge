describe('Router', function (){
	var responseService = new ResponseService(),
		unitTestMocks = new UnitTestMocks(),
		unitTestData = new UnitTestData(),
		path = unitTestMocks.path,
		currentWorkingDir = 'c:/',
		userConfigs = unitTestData.userConfigs,
		url = unitTestMocks.url, 
		Buffer;
			
	describe('routePost', function() {
		beforeEach(function() {
			Buffer = function (auth, type) {
					return {
						toString: function (param) {
							if (param){
								return 'ABC123#';
							} else {
								return 'user:pass';
							}
						}
					}
				};
				
			router = new Router(path, unitTestMocks.fileSystem, url, currentWorkingDir, configPageObjCreator, auth, responseService, userConfigs, Buffer);
		});

		/*it('routePost /logout should set token to null and call responseService.write204NoContent', function() {
			spyOn(responseService, 'write204NoContent');
			router.post('fName',  unitTestMocks.response, unitTestMocks.request(null, '/logout'), 'contentType');
			expect(responseService.write204NoContent).toHaveBeenCalled();
		});*/
	
	});	

});

	
