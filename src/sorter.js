var userConfigs = require('./configurations.json'),
	sorter = require('./sorter.js'),
	pageSize = 5;

module.exports = {
	getSortedPageObj: function(page, sortBy, sortOrder){
		var page, sortBy, sortOrder, sorted = null, finalConfigs = userConfigs.configurations;
		if (!page){
			page = 1;
		}
		
		if (sortOrder && sortBy){
			if (sortOrder.toLowerCase() === 'desc') {
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
			} else {
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
			}
		}
		
		if (sorted) {
			if (userConfigs.configurations.length > pageSize) {
				if (page > 1) {
					var startIndex = (pageSize * (page - 1));
					var endIndex = userConfigs.configurations.length;
				
					if (startIndex > endIndex) {
						finalConfigs = sorted.slice(startIndex, startIndex + pageSize);
					} else {
						if ((endIndex - startIndex) > pageSize) {
							endIndex = startIndex + pageSize;
						}
						
						finalConfigs = sorted.slice(startIndex, endIndex);
					}
				}
			} else {
				finalConfigs = sorted.slice(0, pageSize);
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