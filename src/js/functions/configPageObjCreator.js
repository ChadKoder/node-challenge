/*var userConfigs = require('../configurations.json');
var sorter = require('./sorter.js')(userConfigs);
var paginator = require('./paginate.js')(userConfigs);
*/

function ConfigPageObjCreator (userConfigs, sorter, paginator){
	return {
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
					finalConfigs = paginator.paginateUserConfigs(sorted, pageSize, page);
				}
			}
			
			var sortedReturnObj = {};
			sortedReturnObj.sorted = finalConfigs;
			sortedReturnObj.total = userConfigs.configurations.length;
			
			return sortedReturnObj;
		} 
	};
}
 