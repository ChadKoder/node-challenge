var fileSystem,
	httpHandler,
	authentication,
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
	
describe ('HttpHandler', function (){
	beforeEach(function(){
		module('HttpHandler');
		require(['../src/js/authentication.js', '../src/js/responseService.js'], function (auth, resService) {
			//fileSystem = fs;
			//authentication = auth;
			//responseService = resService;

		});
		
		httpHandler = new HttpHandler(userConfigs, fileSystem, authentication, responseService, 'currWorkDir');
	//	spyOn(authentication, 'isAuthorized');
		//spyOn(fileSystem, 'readFile');
		//spyOn(fileSystem, 'writeFileSync');
		
	});
	
	describe('handleGetRequest', function(){
		beforeEach(function(){
			spyOn(httpHandler, 'renderFile');
			//spyOn(responseService, 'write401Unauthorized');
		});
		
		it ('should render files for node_modules folders', function(){
			var req = { url: '/' };
			httpHandler.handleGetRequest(null, req, 'node_modules', 'application/json');
			expect(httpHandler.renderFile).toHaveBeenCalled();
			
		});
		
		it ('should render files for src folders', function(){
			var req = { url: '/' };
			httpHandler.handleGetRequest('res', req, 'src', 'application/json');
			expect(httpHandler.renderFile).toHaveBeenCalledWith('res', 'currWorkDir\\src', 'application/json');
			
		});
	});
	
	/*describe('renderFile', function(){
		it ('should call fs.readFile()', function(){
			httpHandler.renderFile();
			//httpHandler.renderFile();
			expect(fileSystem.readFile).toHaveBeenCalled();
		});
	});*/
	 
});
