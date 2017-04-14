'use strict';

/**
 * @ngdoc function
 * @name frequencyMapApp.controller:LiveCtrl
 * @description
 * # HistoricalCtrl
 * Controller of the frequencyMapApp
 */

angular.module('HistoricalController',['HistoricalService'])
  .controller('HistoricalCtrl', function ($scope,$rootScope,Historical) {
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
    
  	$scope.freqSlider = {
  		value:0,
  		options:{
  			floor:0,
  			ceil:1700,
  			step:1.0,
  			minLimit:0,
  			maxLimit:1700,
        onEnd: filterFrequency
  		}
  	};

    $scope.datePicker = {
      date : {
        startDate:new Date(),
        endDate:new Date()
      },
      options:{
        format:"YYYY-MM-DD",
        eventHandlers:{
          'apply.daterangepicker' : filterDateRange
        }
      }
    };

    $scope.timePicker = {
      settings:{
        dropdownToggleState:false,
        noRange:false,
        format:24,
        noValidation:false
      },
      onApplyTimePicker:onApplyTimePicker,
      onClearTimePicker:onClearTimePicker
    };

  //stop polling server for data
  if($rootScope.intervalIDs.length > 0){
    $rootScope.intervalIDs.forEach(function(id){
      clearInterval( id );
    });
    $rootScope.intervalIDs = [];
  }

  let removedSensorFeatures = [];//needed to replot when user reactivates sensor
  let sensorsFeatures = [];
  let heatmapFeatures = [];  

  function filterHeatmap(sensorId){
    let index = -1;
    let length = heatmapFeatures.length;
    for(let i =0 ; i < length; i++){
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

  function filterDateRange(event,picker){
    let index = -1;//needed to remove excess data after formating
    let startDate = event.model.startDate.format().toString();
    index = startDate.indexOf('T');
    startDate = startDate.substring(0,index);

    let endDate = event.model.endDate.format().toString();
    index = endDate.indexOf('T');
    endDate = endDate.substring(0,index);

    let dateRange = "from:"+startDate+"-"+"to:"+endDate;

    console.log("picked date range: "+startDate+" to "+endDate);
  };

  function onApplyTimePicker(){
    let toTime = this.settings.time.toHour + this.settings.time.toMinute;
    let fromTime = this.settings.time.fromHour + this.settings.time.fromMinute;

    let timeRange ='from:'+fromTime+"-"+"to:"+toTime;

    console.log('toTime: '+toTime+" fromTime:"+fromTime);
  };

  function onClearTimePicker(){
    console.log("time range cancelled");
  };

  function filterFrequency(){
    console.log("filter frequency "+$scope.freqSlider.value);
  };

  function filterSensor(id){
    console.log("filter sensor "+id);
  };  

});