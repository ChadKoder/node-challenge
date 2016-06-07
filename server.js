var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	httpHandler = require('./src/httpHandlerService'),
	childProcess = require('child_process'),
	browserToLaunch = '',
	chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	iexplore = 'C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe',
	arg = process.argv[2], userArg = null;
	
const PORT = 8888;

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
			console.log('iexplore does not exist, please manually launch your browser and navigate to "http://localhost:8888"');
			browserToLaunch = '';
		}
	} else if (userArg === 'tests/') {
		browserToLaunch = null;
		return;
	}
}

if (browserToLaunch){
	childProcess.spawn(browserToLaunch, ['http://localhost:8888']);
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
			httpHandler.handleGetRequest(res, req, url, contentType);
			break;
		case 'POST':
			httpHandler.handlePostRequest(res, req, contentType);
			break;
		case 'PUT':
			httpHandler.handlePutRequest(res, req, contentType);
			break;
		case 'DELETE':
			httpHandler.handleDeleteRequest(res, req.url, contentType);
			break;
		default:
	}
	 
}).listen(parseInt(PORT, 10)); 

console.log('Server running at --> http://localhost:' + PORT + '/\nCTRL+C to shutdown');