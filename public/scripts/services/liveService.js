angular.module("LiveService",[])
.factory("Live",function($http){
	var liveFactory = {}

	liveFactory.get = function(){
		return $http.get("/api/live/");
	};

	liveFactory.getSensors = function(){
		return $http.post("/api/live/sensors/");
	};

	liveFactory.getReadings = function(filters){
		return $http.post("/api/live/readings/",filters);
	}

	return liveFactory;
});