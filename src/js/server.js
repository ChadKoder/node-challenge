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
	currentWorkingDir = process.cwd();

var responseService = require('./js/responseService.js');
var resService = new responseService();
var router = require('./js/router.js')(path, fs, url, currentWorkingDir, resService, Buffer);
var httpHandler = require('./js/httpHandlerService')(path, currentWorkingDir, router, resService);
	
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
                  
    //console.log('attempting to load: ' + uri);
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
