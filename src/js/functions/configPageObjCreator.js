/*var userConfigs = require('../configurations.json');
var sorter = require('./sorter.js')(userConfigs);
var paginator = require('./paginate.js')(userConfigs);
*/
var configs, sort, paginate;

function ConfigPageObjCreator (){
	return {
		init: function (userConfigs, sorter, paginator){
			configs = userConfigs;
			sort = sorter;
			paginate = paginator;
		},
		getSortedPageObj: function(pg, pageSize, sortBy, sortOrder){
			var page, sorted = null, finalConfigs = configs.configurations;
			if (!pg){
				page = 1;
			} else {
				page = pg;
			}
			
			if (sortOrder){
				if (sortOrder.toLowerCase() === 'desc') {
					sorted = sort.getSortDesc(sortBy);
				} else {
					sorted = sort.getSortAsc(sortBy);
				}
			}
			
			if (sorted) {
				if (pageSize) {
					finalConfigs = paginate.paginateUserConfigs(sorted, pageSize, page);
				}
			}
			
			var sortedReturnObj = {};
			sortedReturnObj.sorted = finalConfigs;
			sortedReturnObj.total = configs.configurations.length;
			
			return sortedReturnObj;
		} 
	};
}

module.exports = ConfigPageObjCreator;