module.exports = function (userConfigs) {
	return {
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
		sortByHostNameDesc: function(){
			return userConfigs.configurations.sort(function(x, y) {
			if (x.hostname.toLowerCase() > y.hostname.toLowerCase()){
				return -1;
			}
			if (x.hostname.toLowerCase() < y.hostname.toLowerCase()){
				return 1;
			}
			
			return 0;
			});
		},
		sortByPortDesc: function(){
			return userConfigs.configurations.sort(function(x, y) {
			if (x.port > y.port){
				return -1;
			}
			if (x.port < y.port){
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
		},
		sortByUserNameDesc: function (){
			return userConfigs.configurations.sort(function(x, y) {
				if (x.username.toLowerCase() > y.username.toLowerCase()){
					return -1;
				}
				if (x.username.toLowerCase() < y.username.toLowerCase()){
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
		getSortDesc: function (sortBy){
			var sorted = null;
			if (sortBy.toLowerCase() === 'hostname') {
				sorted = this.sortByHostNameDesc();
			} else if (sortBy.toLowerCase() === 'port') {
				sorted = this.sortByPortDesc();
			} else if (sortBy.toLowerCase() === 'username') {
				sorted = this.sortByUserNameDesc();
			} else {
				//default - sort by name desc
				sorted = this.sortByNameDesc();
			}
			
			return sorted;
		},
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
		getSortAsc: function (sortBy) {
			var sorted = null;
			if (sortBy.toLowerCase() === 'hostname') {
				sorted = this.sortByHostNameAsc();
			} else if (sortBy.toLowerCase() === 'port') {
				sorted = this.sortByPortAsc();
			} else if (sortBy.toLowerCase() === 'username') {
				sorted = this.sortByUserNameAsc();
			} else {
				//default - sort by name asc
				sorted = this.sortByNameAsc();
			}
			
			return sorted;
		}
	}
};