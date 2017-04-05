'use strict';

var filterModule = (function(){
	//filter map by {type : filter constraint}
	var filters = {};

	var addFilter = function(type,filter){
		// console.log("adding filter");
		var types = Object.keys(filters);
		filters[type] = filter;
	};

	var removeFilter = function(type,filter){
		var filterLst = filters[type];
		var index = filterLst.indexOf(filter);
		filterLst.slice(index,1);

		if(filterLst.length === 0){
			delete filters[type];
		}
	};

	var filter = function(data){

	};

	var isEmpty = function(){ return (Object.keys(filters).length === 0); };

	function containsType(type){
		var types = Object.keys(filters);
		// console.log(types);
		return (types.indexOf(type) !== -1);
	};

	//determines if all filters are present. needed before quering the db.
	var isFullSet = function(){
		// console.log("checking if full set");
		// console.log("checking frequency: "+containsType("frequency"));
		// console.log("checking dateRanage: "+containsType("dateRange"));
		// console.log("checking timeRange: "+containsType("timeRange"));
		if( containsType("frequency") && 
			containsType("dateRange") && 
			containsType("timeRange") ){
			// console.log("full set is true");
			return true;
		}else{ return false; }
	};

	var getFreqFilter = function(){ return filters['frequency']; };
	var getDateRangeFilter = function(){ return filters['dateRange']; };
	var getTimeRangeFilter = function(){ return filters['timeRange']; };

	return{
		addFilter : addFilter,
		removeFilter : removeFilter,
		isEmpty : isEmpty,
		filter : filter,
		isFullSet : isFullSet,
		getFreqFilter : getFreqFilter,
		getDateRangeFilter : getDateRangeFilter,
		getTimeRangeFilter : getTimeRangeFilter
	};
})();

module.exports = filterModule;