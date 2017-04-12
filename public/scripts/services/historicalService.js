angular.module("HistoricalService",[])
.factory("Historical",function($http){
	var historicalFactory = {}

	historicalFactory.get = function(){
		return $http.get("/api/historical/");
	};

	historicalFactory.getReadings = function(filters){
		return $http.post("/api/historical/",filters);
	};

	return historicalFactory;
});