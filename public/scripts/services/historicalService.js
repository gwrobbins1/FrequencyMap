angular.module("HistoricalService",[])
.factory("Historical",function($http){
	var historicalFactory = {}

	historicalFactory.get = function(){
		return $http.get("/api/historical/");
	};

	historicalFactory.filter = function(sensorId){
		return $http.post("/api/historical/sensor/"+sensorId);
	};
	
	historicalFactory.filterFrequency = function(freq){
		return $http.post("/api/historical/freq/"+freq);
	};

	historicalFactory.filterDate = function(dateRange){
		return $http.post("/api/historical/date/"+dateRange);
	};

	historicalFactory.filterTime = function(timeRange){
		return $http.post("/api/historical/time/"+timeRange);
	};

	return historicalFactory;
});