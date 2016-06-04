angular.module('sampleApp.controllers', []).
controller('MainCtrl', function($scope) {
	$scope.logout = function (){
		alert('logging out');
	}
	
	$scope.isValid = function(){
		
	}
});