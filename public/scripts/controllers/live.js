'use strict';

/**
 * @ngdoc function
 * @name frequencyMapApp.controller:LiveCtrl
 * @description
 * # LiveCtrl
 * Controller of the frequencyMapApp
 */
angular.module('LiveController',["LiveService"])
.controller('LiveCtrl',function ($scope, $rootScope, Live) {
  //stop polling when no sensors are selected or 0MHz is selected on slider
  let readingsPoll;

  if($rootScope.intervalIDs === undefined){
    $rootScope.intervalIDs = [];
  }else{
    //stop polling server for data
    if($rootScope.intervalIDs.length > 0){
      $rootScope.intervalIDs.forEach(function(id){
        clearInterval( id );
      });
      $rootScope.intervalIDs = [];
    }
  }

  $scope.sensors = [];
  $scope.filters = {
    sensors : [],
    frequency : 0
  };

	$scope.freqSlider = {
		value:0,
		options:{
			floor:0,
			ceil:225,
			step:1,
  		minLimit:0,
  		maxLimit:225,
      onChange: sliderChangeHandler
		}
	};

  function sliderChangeHandler(val,hiVal,pntrType){
    $scope.filters.frequency = hiVal;
    if(hiVal !== 0){
      pollForReadings();
      readingsPoll = setInterval(pollForReadings,1e3);//per second
      $rootScope.intervalIDs.push(readingsPoll);
    }else{//stop polling if frequency = 0
      if(readingsPoll !== undefined){
        let index = $rootScope.intervalIDs.indexOf(readingsPoll);
        $rootScope.intervalIDs.splice(index,1);
        clearInterval(readingsPoll);
      }
    }
  };

  //stop polling server for data when page changes
  if($rootScope.intervalIDs.length > 0){
    $rootScope.intervalIDs.forEach(function(id){
      clearInterval( id );
    });
    $rootScope.intervalIDs = [];
  }

  var getSensors = function(){
    Live.getSensors()
    .then(function(res){
      if(res.data && res.data.sensors){
        if($scope.sensors === undefined || $scope.sensors.length === 0){
          $scope.sensors = res.data.sensors;
          $scope.sensors.forEach(function(sensor){
            sensor.isActive = true;
          });
        }else{
          let deactivated = [];
          $scope.sensors.forEach(function(sensor){
            if(sensor.isActive === false){
              deactivated.push(sensor.SID);
            }
          });

          $scope.sensors = res.data.sensors;
          $scope.sensors.forEach(function(sensor){
            sensor.isActive = (deactivated.includes(sensor.SID)) ? 
                              false : true;
          });
        }
      }
    },function(err){
      console.log(err);
    });
  };
  getSensors();//gets sensors on initial page load

  let sensorsFeatures = [];
  let heatmapFeatures = [];  
  function pollForReadings(){
    Live.getReadings($scope.filters)
    .then(function(res){
      // if(res.data.length > 0){
      if(res.data.readings.length > 0){        
        // console.log(res.data);
        let numSensors = $scope.sensors.length;
        res.data.readings.forEach(function(sensorReading){
          for(let i=0;i<numSensors;i++){
            if($scope.sensors[i].SID === sensorReading.Sensors_SID){
              $scope.sensors[i].TIME = sensorReading.TIME;
              $scope.sensors[i].READINGS = sensorReading.READINGS;
              break;
            }
          }
        });

       if(sensorsFeatures.length === 0){
          sensorsFeatures = mapModule.makeSensorFeatureArray($scope.sensors);            
          mapModule.addSensorLayer(sensorsFeatures);            
        }//else would be used if the sensors are changing location.
        heatmapFeatures = mapModule.plotHeatmap($scope.freqSlider.value,$scope.sensors);        
      }

      let interpolationData = res.data.interpolation;
      mapModule.plotInterpolation(interpolationData);
    },function(err){
      console.log(err);
    });
  };  
  
  let sensorPoll = setInterval(getSensors,60e3);//update sensors every minute
  $rootScope.intervalIDs.push(sensorPoll);

  function filterHeatmap(sensorId){
    let index = -1;
    for(let i =0 ; i < heatmapFeatures.length; i++){
      if(heatmapFeatures[i].getId() === sensorId){
        index = i;
        break;
      }
    }

    if(index !== -1){
      mapModule.removeSensorHeatmap(heatmapFeatures[index]);
      heatmapFeatures.splice(index,1);
    }
  };

  let removedSensorFeatures = [];//needed to replot when user reactivates sensor
  $scope.filter = function(sensorId){
    console.log("filtering sensor: "+sensorId);
    let filteredSensors = $scope.filters.sensors;

    if(filteredSensors.includes(sensorId)){
      let index = filteredSensors.indexOf(sensorId);
      filteredSensors.splice(index,1);
    }else{
      $scope.filters.sensors.push(sensorId);
    }

    filterHeatmap(sensorId);
    let index = -1;
    for(var i=0; i<sensorsFeatures.length;i++){
      if(sensorsFeatures[i].getId() === sensorId){
        index = i;
        break;
      }
    }
    if(index !== -1){//found in sensorFeatures
      let del = sensorsFeatures.splice(i,1);//returns an array
      removedSensorFeatures.push(del[0]);
      mapModule.removeSensor(del[0]);
    }else{//index == -1, sensor not found in sensorFeatures
      //check if sensor is in removed features so we can replot
      for(i = 0; i<removedSensorFeatures.length;i++){
        if(removedSensorFeatures[i].getId() === sensorId){
          index = i;
          break;
        }
      }      

      if(index !== -1){//found in removed features
        let replot = removedSensorFeatures.splice(index,1);//returns array
        sensorsFeatures.push(replot[0]);
        mapModule.addSensor(replot[0]);
      }
    }
  };
});