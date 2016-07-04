function Paginator(userConfigs){
	return {
		paginateUserConfigs: function (sorted, pageSize, page){
			var paginatedConfigs = null;
			if (userConfigs.configurations.length > pageSize) {
				if (parseInt(page) > 1) {
					var startIndex = (parseInt(pageSize) * (parseInt(page) - 1));
					var endIndex = userConfigs.configurations.length;
				
					if (parseInt(startIndex) > parseInt(endIndex)) {
						paginatedConfigs = sorted.slice(startIndex, startIndex + pageSize);
					} else { 
						if ((parseInt(endIndex) - parseInt(startIndex)) > parseInt(pageSize)) {
							endIndex = parseInt(startIndex) + parseInt(pageSize);
						} 
						
						paginatedConfigs = sorted.slice(startIndex, endIndex);
					}
				} else {
				paginatedConfigs = sorted.slice(0, pageSize);
				}
			} else {
				paginatedConfigs = sorted;
			}
			
			return paginatedConfigs;
		}
	};
}

module.exports = Paginator;