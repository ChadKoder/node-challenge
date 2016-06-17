/*describe('httpHandler', function(){
	var fileSystem,
	httpHandler,
	auth,
	p,
	u,
	configPgObjCreator,
	res = {},
	req,
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

	res.write = function() {};
	res.writeHead = function() {};
	res.end = function() {};
	
	
define(['require'],function(require){
	require(['path', 'url', 'fs'], function (path, url, fs){
		p = path;
		u = url;
		fileSystem = fs;
		responseService = new ResponseService();
		auth = new Authentication();
		sorter = new Sorter();
		paginator = new Paginator();
		configPgObjCreator = new ConfigPageObjCreator();
	
	
	});	 
		
}); 
	
		it ('should render node_modules', function(){	
		httpHandler = new HttpHandler(p, u, configPgObjCreator, userConfigs, fileSystem, auth, responseService, 'c:\\workingdir');
		
			req = { url: 'node_modules/' };
			httpHandler.handleGetRequest(res, req, 'application/json');
			expect(1).toEqual(2);
		}); 
});*/