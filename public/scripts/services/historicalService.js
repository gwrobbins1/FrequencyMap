angular.module("HistoricalService",[])
.factory("Historical",function($http){
	var historicalFactory = {}

	historicalFactory.get = function(){
		return $http.get("/api/historical/");
	};

	historicalFactory.getReadings = function(filters){
		return $http.post("/api/historical/readings/",filters);
	};

	historicalFactory.getHistogram = function(filters){
		return $http.post("/api/historical/histogram/",filters);
	};

	historicalFactory.getLineGraph = function(filters){
		return $http.post("/api/historical/linegraph/",filters);
	};

	return historicalFactory;
});