var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	childProcess = require('child_process'),
	browserToLaunch = '',
	chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	iexplore = 'C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe',
	arg = process.argv[2], 
	userArg = null,
	users = require('./src/users.json'),
	//responseService = require('./src/js/functions/responseService.js'),
	userConfigs = require('./src/configurations.json');
	

currentWorkingDir = process.cwd();

var miniFunctions = require('./web/js/functions.js');
var responseService = miniFunctions.ResponseService;

//var res = new authentication();
//var testa = res.test();
 

//var auth = test.Authentication;
//var atest = auth.test123; 
//var sort = test.Sorter(userConfigs);
//var paginate = test.Paginator(userConfigs);
//var configPgObjCreator = test.ConfigPageObjCreator;
//var authRoute = test.AutRouter(path, fs, url, currentWorkingDir, configPageObjCreator, authentication, responseService, userConfigs, Buffer);
//var route = test.Router(path, fs, responseService, authRouter, url);
//var httpHandler = test.HttpHandler (path, currentWorkingDir, userConfigs, authentication, router, authRouter, responseService);


var authentication = miniFunctions.Authentication(users);
var sorter = miniFunctions.Sorter(userConfigs);
var paginator = miniFunctions.Paginator(userConfigs);
var configPageObjCreator = miniFunctions.ConfigPageObjCreator(userConfigs, sorter, paginator);
var authRouter = miniFunctions.AuthRouter(path, fs, url, currentWorkingDir, configPageObjCreator, authentication, new responseService(), userConfigs, Buffer);
var router = miniFunctions.Router(path, fs, new responseService(), authRouter, url);
var httpHandler = miniFunctions.HttpHandler(path, currentWorkingDir, userConfigs, authentication, router, authRouter, new responseService());
//var authentication = auth(users);
//var httpHandler = httpHandlr(path, currentWorkingDir, userConfigs, authentication, router, authRouter, responseService);
/*var authentication = auth;
var sorter = sort(userConfigs);
var paginator = paginate(userConfigs);
var configPageObjCreator = configPgObjCreator(userConfigs, sorter, paginator);
var authRouter = authRoute(path, fs, url, currentWorkingDir, configPageObjCreator, authentication, responseService, userConfigs, Buffer);
var router = route(path, fs, responseService, authRouter, url);
var httpHandler = httpHandlr(path, currentWorkingDir, userConfigs, authentication, router, authRouter, responseService);
*/

//var authentication = require('./src/js/functions/authentication.js')(users);
//var sorter = require('./src/js/functions/sorter.js')(userConfigs);
//var paginator = require('./src/js/functions/paginator.js')(userConfigs);
//var configPageObjCreator = require('./src/js/functions/configPageObjCreator')(userConfigs, sorter, paginator);
//var authRouter = require('./src/js/functions/authRouter.js')(path, fs, url, currentWorkingDir, configPageObjCreator, authentication, responseService, userConfigs, Buffer);
//var router = require('./src/js/functions/router.js')(path, fs, responseService, authRouter, url);
//var httpHandler = require('./src/js/functions/httpHandlerService')(path, currentWorkingDir, userConfigs, authentication, router, authRouter, responseService);
	
const PORT = 8888;
var serverAdd = 'http://localhost:' + PORT;


if (arg){
	userArg = arg.toLowerCase();
}
	
if (userArg){
	console.log('attempting to run node with ' + userArg + '...');
	
	if (userArg === 'chrome'){
		try {
			fs.statSync(chrome);
			browserToLaunch = chrome;
		} catch(e) {
			console.log('chrome does not exist, setting to launch with iexplore');
			browserToLaunch = iexplore;
		}
	} else if (userArg === 'iexplore'){
		try {
			fs.statSync(iexplore);
			browserToLaunch = iexplore;
		} catch(e) {
			console.log('iexplore does not exist, please manually launch your browser and navigate to ' + serverAdd);
			browserToLaunch = '';
		}
	} else if (userArg === 'serverTests/') {
		browserToLaunch = null;
		return;
	}
}

if (browserToLaunch){
	childProcess.spawn(browserToLaunch, [serverAdd]);
}

var urlContains = function(url, str){
	return url.indexOf(str) != -1;
};

var setContentType = function (url) {
	var contentType = 'text/html';
	
	if (urlContains(url, '.html')){
		contentType = 'text/html';
	} else if (urlContains(url, '.css')){
		contentType = 'text/css';
	} else if (urlContains(url, '.js')) {
		contentType = 'text/javascript';
	}
	
	return contentType;
};

http.createServer(function (req, res) {
	var contentType,
	contentType = setContentType(req.url);
	
	switch (req.method){
		case 'GET':
			httpHandler.handleGetRequest(res, req, contentType);
			break;
		case 'POST':
			httpHandler.handlePostRequest(res, req, contentType);
			break;
		case 'PUT':
			httpHandler.handlePutRequest(res, req, contentType);
			break;
		case 'DELETE':
			httpHandler.handleDeleteRequest(res, req, contentType);
			break;
		default:
	}
	 
}).listen(parseInt(PORT)); 

console.log('Server running at --> ' + serverAdd + '/\nCTRL+C to shutdown');