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
	users = require('./users.json'),
	userConfigs = require('./configurations.json');
	

currentWorkingDir = process.cwd();

var responseService = require('../src/js/functions/responseService.js');
var authentication = require('../src/js/functions/authentication.js');//(users);
var sorter = require('../src/js/functions/sorter.js');//(userConfigs);
var paginator = require('../src/js/functions/paginator.js');//(userConfigs);
var configPageObjCreator = require('../src/js/functions/configPageObjCreator');//(userConfigs, sorter, paginator);
var authRouter = require('../src/js/functions/authRouter.js');
var auth = new authentication(users);
var authorizationRouter = new authRouter();
var resService = new responseService();
var sort = new sorter(userConfigs);
var paginate = new paginator(userConfigs);
var configPgObjectCreator = new configPageObjCreator();
configPgObjectCreator.init(userConfigs, sort, paginate);
authorizationRouter.init(path, fs, url, currentWorkingDir, configPgObjectCreator, auth, resService, userConfigs, Buffer);


var router = require('../src/js/functions/router.js')(path, fs, resService, authorizationRouter, url);


var httpHandler = require('../src/js/functions/httpHandlerService')(path, currentWorkingDir, userConfigs, auth, router, authorizationRouter, resService);
	
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

	var uri = url.parse(req.url).pathname;
	/*TODO: Figure out it's trying to load src/ when it does not exist*/
	if (uri.indexOf('/src/') > -1) {
		req.url = uri.replace('src/', '');
	}
	
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

//module.exports = app;

console.log('Server running at --> ' + serverAdd + '/\nCTRL+C to shutdown');
