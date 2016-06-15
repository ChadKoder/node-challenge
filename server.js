var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	childProcess = require('child_process'),
	browserToLaunch = '',
	chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	iexplore = 'C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe',
	arg = process.argv[2], 
	userArg = null,
	users = require('./src/users.json'),
	responseService = require('./src/js/responseService.js'),
	userConfigs = require('./src/configurations.json');
	
	var authentication = require('./src/js/authentication.js')(users);
	
var httpHandler = require('./src/js/httpHandlerService')(userConfigs, fs, authentication, responseService, process.cwd());
	
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
	var contentType, uri = url.parse(req.url).pathname,
	contentType = setContentType(req.url);
	
	switch (req.method){
		case 'GET':
			httpHandler.handleGetRequest(res, req, uri, contentType);
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