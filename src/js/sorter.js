
/*TODO: add better support for sorting by a url (ex: hostname)*/
function Sorter (userConfigs) {
	return {
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
			if (sortBy) {
				if (sortBy.toLowerCase() === 'hostname') {
					return this.sortByHostNameAsc();
				} else if (sortBy.toLowerCase() === 'port') {
					return this.sortByPortAsc();
				} else if (sortBy.toLowerCase() === 'username') {
					return this.sortByUserNameAsc();
				}
			}
			
			return this.sortByNameAsc();
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
		getSortDesc: function (sortBy){
			if (sortBy) {
				if (sortBy.toLowerCase() === 'hostname') {
					return this.sortByHostNameDesc();
				} else if (sortBy.toLowerCase() === 'port') {
					return this.sortByPortDesc();
				} else if (sortBy.toLowerCase() === 'username') {
					return this.sortByUserNameDesc();
				}
			}
						
			return this.sortByNameDesc();
		}
	}
}

module.exports = Sorter;
 
	