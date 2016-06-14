var userConfigs = require('./configurations.json'),
	sorter = require('./sorter.js');

module.exports = {
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
	},
	getSortedPageObj: function(pg, pageSize, sortBy, sortOrder){
		var page, sorted = null, finalConfigs = userConfigs.configurations;
		if (!pg){
			page = 1;
		} else {
			page = pg;
		}
		
		if (sortOrder){
			if (sortOrder.toLowerCase() === 'desc') {
				sorted = this.getSortDesc(sortBy);
			} else {
				sorted = this.getSortAsc(sortBy);
			}
		}
		
		if (sorted) {
			if (pageSize) {
				if (userConfigs.configurations.length > pageSize) {
					if (page > 1) {
						var startIndex = (pageSize * (page - 1));
						var endIndex = userConfigs.configurations.length;
					
						if (startIndex > endIndex) {
							finalConfigs = sorted.slice(startIndex, startIndex + pageSize);
						} else { 
							if ((endIndex - startIndex) > pageSize) {
								endIndex = parseInt(startIndex) + parseInt(pageSize);
							}
							
							finalConfigs = sorted.slice(startIndex, endIndex);
						}
					} else {
					finalConfigs = sorted.slice(0, pageSize);
					}
				} else {
					finalConfigs = sorted;
				}
			}
		}
		
		var sortedReturnObj = {};
		sortedReturnObj.sorted = finalConfigs;
		sortedReturnObj.total = userConfigs.configurations.length;
		
		return sortedReturnObj;
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
	}
};