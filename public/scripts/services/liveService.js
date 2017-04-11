angular.module("LiveService",[])
.factory("Live",function($http){
	var liveFactory = {}

	liveFactory.get = function(){
		return $http.get("/api/live/");
	};

	liveFactory.getSensors = function(){
		return $http.post("/api/live/sensors/");
	}

	liveFactory.filter = function(sensorId){
		return $http.post("/api/live/"+sensorId);
	};

	liveFactory.clearFilters = function(){
		return $http.post("/api/live/clear/");
	}
	
	return liveFactory;
});