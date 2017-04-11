var sensorModule = (function(){
	var sensorCache = [];
	var sensorFilters = [];
	var cahcedSensorIds = [];

	var cache = function(sensorData){
		//initial sensor caching and new sensor data coming online.
		if(sensorData.length > sensorCache.length){
			var sensorsToAdd = addSensors(sensorData);
			sensorsToAdd.map(sensorSetActive);
			sensorsToAdd.forEach(function(sensor){
				sensorCache.push(sensor);
			});
		}else if(sensorData.length < sensorCache.length){//remove sensor
			var sensorsToRemove = removeSensors(sensorData);
			sensorsToRemove.forEach(function(sensor){
				var index = getSensorIndex(sensor.id);
				sensorCache.splice(index,1);
				for(index = 0; index < cachedSensorIds.length; index++){
					if(cahcedSensorIds[index] === sensor.id){
						break;
					}
				}
				cahcedSensorIds.splice(index,1);
			});
		}else{//updating sensors
			sensorData.forEach(function(sensor){
				var index = getSensorIndex(sensor.id);
				sensorCache[index].readings = sensor.readings;
				sensorCache[index].timeStamp = sensor.timeStamp;
			});
		}
		filter();
		return sensorCache;
	};

	function addSensors(sensorData){
		if(cahcedSensorIds.length === 0){
			sensorData.forEach(function(sensor){
				cahcedSensorIds.push(sensor.id);
			});
			return sensorData;
		}else{//only return new sensors
			var newSensors = [];
			sensorData.forEach(function(sensor){
				var index  = cahcedSensorIds.indexOf(sensor.id);
				if(indexOf === -1){
					cahcedSensorIds.push(sensor.id);
					newSensors.push(sensor);
				}
			});

			return newSensors;
		}
	};

	function getSensorIndex(id){
		for(var i=0;i<sensorCache.length;i++){
			if(sensorCache[i].id === id){
				break;
			}
		}
		return i;
	};

	function sensorSetActive(sensor){
		sensor.isActive = true;
	};

	function filter(){
		sensorFilters.forEach(function(id){
			var index = getSensorIndex(id);
			if(sensorCache[index]){
				sensorCache[index].isActive = false;
			}
		});
	};

	var isCacheEmpty = function(){
		return (sensorCache.length === 0);
	};

	var addFilter = function(sensorId){
		sensorId = parseInt(sensorId);
		if(sensorFilters.indexOf(sensorId) === -1){
			sensorFilters.push(sensorId);
		}else{
			var index = sensorFilters.indexOf(sensorId);
			sensorFilters.splice(index,1);
			index = getSensorIndex(sensorId);
			sensorSetActive(sensorCache[index]);
		}
	};

	return {
		cache : cache,
		isCacheEmpty : isCacheEmpty,
		// filter : filter,
		addFilter : addFilter
	};

})();

module.exports = sensorModule;