angular.module("HistoricalService",[])
.factory("Historical",function($http){
	var historicalFactory = {}

	historicalFactory.get = function(){
		return $http.get("/api/live/");
	};

	historicalFactory.filter = function(sensorId){
		return $http.post("/api/live/"+sensorId);
	};
	
	return historicalFactory;
});