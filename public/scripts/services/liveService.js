angular.module("LiveService",[])
.factory("Live",function($http){
	var liveFactory = {}

	liveFactory.get = function(){
		return $http.get("/api/live/");
	};

	liveFactory.filter = function(sensorId){
		return $http.post("/api/live/"+sensorId);
	};
	
	return liveFactory;
});