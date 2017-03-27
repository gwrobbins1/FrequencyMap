'use strict';

/**
 * @ngdoc function
 * @name frequencyMapApp.controller:LiveCtrl
 * @description
 * # LiveCtrl
 * Controller of the frequencyMapApp
 */
// angular.module('frequencyMapApp')
angular.module('LiveController',["LiveService"])
.controller('LiveCtrl',function ($scope, $rootScope, Live) {
  $scope.sensors = [];

	$scope.freqSlider = {
		value:0,
		options:{
			floor:0,
			ceil:1700,
			step:0.5,
  		minLimit:0,
  		maxLimit:1700
		}
	};

  //stop polling server for data
  if($rootScope.intervalID){
      clearInterval( $rootScope.intervalID );
      $rootScope.intervalID = undefined;
  }

  let sensorsFeatures = [];
  var pollServer = function(){
    Live.get()
    .then(function(res){
      $scope.sensors = res.data;
      if(sensorsFeatures.length === 0){
        sensorsFeatures = mapModule.makeSensorFeatureArray($scope.sensors);            
        mapModule.addSensorLayer(sensorsFeatures);            
      }//else would be used if the sensors are changing location.
      // mapModule.plotHeatMap($scope.freqSlider.value,res.data);
    });
  };

  pollServer();//load data on initial load.
  $rootScope.intervalID = setInterval(pollServer,1000);//update data every second.

  let removedSensorFeatures = [];//needed to replot when user reactivates sensor
  $scope.filter = function(sensorId){
    Live.filter(sensorId)
    .then(function(res){
      // console.log(res.data);
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
    });
  };
});