userConfigs = require('./configurations.json');

module.exports = {
	sortByNameAsc: function (){
		return userConfigs.configurations.sort(function(x, y) {
		if (x.name.toLowerCase() < y.name.toLowerCase()){
			return -1;
		}
		if (x.name.toLowerCase() > y.name.toLowerCase()){
			return 1;
		}
		
		return 0;
		}); 
	},
	sortByNameDesc: function (){
		return userConfigs.configurations.sort(function(x, y) {
		if (x.name.toLowerCase() > y.name.toLowerCase()){
			return -1;
		}
		if (x.name.toLowerCase() < y.name.toLowerCase()){
			return 1;
		}
		
		return 0;
		}); 
	},
	sortByHostNameAsc: function(){
		return userConfigs.configurations.sort(function(x, y) {
		if (x.hostname.toLowerCase() < y.hostname.toLowerCase()){
			return -1;
		}
		if (x.hostname.toLowerCase() > y.hostname.toLowerCase()){
			return 1;
		}
		
		return 0;
		});
	},
	sortByPortAsc: function(){
		return userConfigs.configurations.sort(function(x, y) {
		if (x.port < y.port){
			return -1;
		}
		if (x.port > y.port){
			return 1;
		}
		
		return 0;
		});
	},
	sortByUserNameAsc: function (){
		return userConfigs.configurations.sort(function(x, y) {
			if (x.username.toLowerCase() < y.username.toLowerCase()){
				return -1;
			}
			if (x.username.toLowerCase() > y.username.toLowerCase()){
				return 1;
			}
			
			return 0;
		});
	}
};