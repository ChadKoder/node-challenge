var userConfigs = require('./configurations.json');
var sorter = require('./sorter.js')(userConfigs);

module.exports = {
	getSortedPageObj: function(pg, pageSize, sortBy, sortOrder){
		var page, sorted = null, finalConfigs = userConfigs.configurations;
		if (!pg){
			page = 1;
		} else {
			page = pg;
		}
		
		if (sortOrder){
			if (sortOrder.toLowerCase() === 'desc') {
				sorted = sorter.getSortDesc(sortBy);
			} else {
				sorted = sorter.getSortAsc(sortBy);
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
	} 
};