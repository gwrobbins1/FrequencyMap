'use strict';

var filterModule = (function(){
	//filter map by {type : filter constraint}
	var filters = {};
	filters.sensors = [];

	var addFilter = function(type,filter){
		switch(type){
			case "sensor":
				filter = parseInt(filter);
				var filterLst = filters.sensors;
				var index = filterLst.indexOf(filter);
				if( index !== -1 ){//found
					console.log("removing filter");
					filters.sensors.splice(index,1);//remove from list of filters
				}else{
					console.log("adding new filter");
					filters.sensors.push(filter);
				}			
				break;
		}
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
		return (types.indexOf(type) !== -1);
	};

	//determines if all filters are present. needed before quering the db.
	var isFullSet = function(){
		if( containsType("frequency") && 
			containsType("dateRange") && 
			containsType("timeRange") ){
			return true;
		}else{ return false; }
	};

	var getFreqFilter = function(){ return filters['frequency']; };
	var getDateRangeFilter = function(){ return filters['dateRange']; };
	var getTimeRangeFilter = function(){ return filters['timeRange']; };
	var getSensorFilters = function(){ return filters.sensors;}

	return{
		addFilter : addFilter,
		removeFilter : removeFilter,
		isEmpty : isEmpty,
		filter : filter,
		isFullSet : isFullSet,
		getSensorFilters : getSensorFilters,
		getFreqFilter : getFreqFilter,
		getDateRangeFilter : getDateRangeFilter,
		getTimeRangeFilter : getTimeRangeFilter
	};
})();

module.exports = filterModule;