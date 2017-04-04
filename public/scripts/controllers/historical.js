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

    if(typeof $rootScope.intervalID !== 'undefined' ){
        clearInterval( $rootScope.intervalID );
        $rootScope.intervalID = undefined;
    }

  let removedSensorFeatures = [];//needed to replot when user reactivates sensor
  let sensorsFeatures = [];
  let heatmapFeatures = [];  
  // var pollServer = function(){
  //   Historical.get()
  //   .then(function(res){
  //     $scope.sensors = res.data;
  //     $scope.sensors.forEach(function(sensor){
  //       let val = $scope.freqSlider.value;
  //       let strength = sensor.readings[$scope.freqSlider.value];
  //       sensor.readings = {};
  //       sensor.readings[val] = strength;
  //     });
  //     if(sensorsFeatures.length === 0){
  //       sensorsFeatures = mapModule.makeSensorFeatureArray($scope.sensors);            
  //       mapModule.addSensorLayer(sensorsFeatures);            
  //     }//else would be used if the sensors are changing location.
  //     heatmapFeatures = mapModule.plotHeatmap($scope.freqSlider.value,$scope.sensors);
  //   });
  // };

  // pollServer();//load data on initial load.
  // $rootScope.intervalID = setInterval(pollServer,1000);//update data every second.
  // $rootScope.intervalID = setInterval(pollServer,500);//update data every half second.

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

    Historical.filterDate(dateRange)
    .then(function(res){
      console.log(res.data.message);
    });
    // console.log("picked date range: "+startDate+" to "+endDate);
  };

  function onApplyTimePicker(){
    let toTime = this.settings.time.toHour + this.settings.time.toMinute;
    let fromTime = this.settings.time.fromHour + this.settings.time.fromMinute;

    let timeRange ='from:'+fromTime+"-"+"to:"+toTime;

    Historical.filterTime(timeRange)
    .then(function(res){
      console.log(res.data.message);
    });
    // console.log('toTime: '+toTime+" fromTime:"+fromTime);
  };

  function onClearTimePicker(){
    console.log("time range cancelled");
  };

  $scope.filter = function(sensorId){
    Historical.filter(sensorId)
    .then(function(res){
      // console.log(res.data);
      filterHeatmap(sensorId);
      let index = -1;
      let length = sensorsFeatures.length;
      for(var i=0; i<length;i++){
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
        let length = removedSensorFeatures.length;
        for(i = 0; i<length;i++){
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

  function filterFrequency(){
    // alert("filtering freq: "+$scope.freqSlider.value);
    Historical.filterFrequency($scope.freqSlider.value)
    .then(function(res){
      console.log(res.data.message);
    });
  };

});