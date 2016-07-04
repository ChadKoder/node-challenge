//js/controllers/LoginCtrl.js
angular.module('LoginCtrl', []).controller('LoginCtrl', ['$http', '$mdToast', '$location',
 function ($http, $mdToast, $location) {
	var vm = this;
	vm.title = 'NodeJS Sample Application';
	vm.username = '';
	vm.password = '';
		
	var redirectDelay = 1000;
	
	vm.showSimpleToast = function (msg){
			$mdToast.showSimple(msg);
	};
	
	vm.redir = function(url){
		setTimeout(function(){
				//$window.location = url;
				$location.path(url);
			}, redirectDelay);
	};
	
	vm.login = function (){
		if (!vm.username || !vm.password){
			vm.showSimpleToast('username and password are required!');
			return;
		}
		
		var encodedAuth = btoa(vm.username + ':' + vm.password);
		$http.defaults.headers.common.Authorization = 'Basic ' + encodedAuth;
		
		var req = {
			method: 'GET',
			url: '/validateUser',
			data: { config: vm.selectedConfig }
		};
		
		$http(req).success(function(){
			vm.showSimpleToast('Login Successful! redirecting...');
			vm.redir('/user-configurations');
		}).error(function(res){
			if (res === '401 Unauthorized'){
				vm.showSimpleToast('Unauthorized user!');
			} else {
				vm.showSimpleToast('an error has occurred.');
			}
		});
	};
}]);