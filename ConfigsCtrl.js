angular.module('sampleApp.controllers', []).
controller('ConfigsCtrl', function($scope) {
	$scope.totalStairs = null;
	
	$scope.logout = function (){
		window.location.href = '/';
	}
	
	$scope.isValid = function(){
		
	}
	
	$scope.showStairs = function(total) {
		
	}
});