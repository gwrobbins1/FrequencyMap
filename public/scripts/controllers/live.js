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
      if(typeof $rootScope.intervalID !== 'undefined' ){
          clearInterval( $rootScope.intervalID );
          $rootScope.intervalID = undefined;
      }

      var sensorsFeatures = [];
      var pollServer = function(){
        Live.get()
        .then(function(res){
          $scope.sensors = res.data;
          if(sensorsFeatures.length === 0){
            sensorsFeatures = mapModule.makeSensorFeatureArray($scope.sensors);            
            mapModule.addSensorLayer(sensorsFeatures);            
          }
        });
      };

      pollServer();//load data on initial load.
      $rootScope.intervalID = setInterval(pollServer,1000);//update data every second.

  		$scope.submit = function(){
  			console.log('clicked submit');
  		};

  		$scope.reset = function(){
  			console.log('clicked reset');
  		};

      $scope.filter = function(sensorId){
        console.log(sensorId);
        Live.filter(sensorId)
        .then(function(res){
          console.log(res.data);
        });
      };
  });
