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
    
    //binds incoming sensors with angular 
    //check boxes and table
    $scope.sensors = [];
    $scope.filters = {
      sensors : [],
      frequency : 0,
      dateRange : [],
      timeRange : []
    };

  	$scope.freqSlider = {
  		value:0,
  		options:{
  			floor:0,
  			ceil:225,
  			step:1.0,
  			minLimit:0,
  			maxLimit:225,
        onChange: filterFrequency
  		}
  	};

    $scope.datePicker = {
      date : {
        startDate:new Date(),
        endDate:new Date()
      },
      options:{
        format:"MM-DD-YYYY",
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

    $scope.histLabels = ['>0','>10','>20','>30','>40','>50',
                        '>60','>70','>80','>90'];
    $scope.lineLabels = [];

  let removedSensorFeatures = [];//needed to replot when user reactivates sensor
  let sensorFeatures = [];
  let heatmapFeatures = [];
  let previousViewDates = [];
  let interupt = false;
  let beginNext = true;
  let checkIfBusyInterval = undefined;

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

  function generateDateTimeStack(date0,time0,date1,time1){
    let results = [];

    //adding : to time for moment.
    time0 = time0.substring(0,2)+":"+time0.substring(2,4);
    time1 = time1.substring(0,2)+":"+time1.substring(2,4);

    let startDate = moment(date0+" "+time0);
    let endDate = moment(date1+" "+time1);

    while(startDate < endDate){
      let temp = moment(startDate.format());
      results.push(temp);
      // $scope.lineLabels.push(temp);
      startDate = startDate.add(5,'m');      
    }
    results.push(endDate);
    return results;
  };

  function loopData(t0,t1,times){
    if(t1 !== undefined && !interupt){
      previousViewDates.push(t1);
      let args = {
        sensorFilters:$scope.filters.sensors,
        freq:$scope.filters.frequency,
        start:t0.format(),
        end:t1.format()
      };
      Historical.getReadings(args)
      .then(function(res){
        //process results
        let deactivated = [];
        $scope.sensors.forEach(function(sensor){
          if(sensor.isActive === false){
            deactivated.push(sensor.SID);
          }
        });

        let readings =res.data.readings;
        $scope.sensors = [];
        readings.forEach(function(reading){
          let time = moment(reading.TIME).format().replace('T',' ');

          $scope.sensors.push({
            SID:reading.SID,
            Latitude:reading.Latitude,
            Longitude:reading.Longitude,
            readings:reading.Readings,
            READINGS:reading.Readings,
            timeStamp:time,
            isActive:(deactivated.includes(reading.SID)) ? 
                              false : true
          });
        });
        
        if(sensorFeatures.length === 0){
          sensorFeatures = mapModule.makeSensorFeatureArray($scope.sensors);
          mapModule.addSensorLayer(sensorFeatures);         
        }

        heatmapFeatures = mapModule.plotHeatmap($scope.freqSlider.value, $scope.sensors);                  
        let interpolationData = res.data.interpolation;
        mapModule.plotInterpolation(interpolationData);         

        t0 = moment(t1.format());
        t1 = times.shift();
        setTimeout(loopData(t0,t1,times),1e3);
        // loopData(t0,t1,times);
      },
      function(err){
        console.log(err);
      });      
    }else{//interupted or end of time stack
      beginNext = true;
      previousViewDates = [];
      sensorFeatures = [];
      mapModule.clearMap();
    }
  };  

  function pollServer(){
    interupt = true;
    //get time stack for play black of sensor readings
    let startDate = $scope.filters.dateRange[0];
    let endDate = $scope.filters.dateRange[1];
    let dateStack = generateDateTimeStack(startDate,$scope.filters.timeRange[0],
                                          endDate, $scope.filters.timeRange[1]);    
    let t0 = dateStack.shift();//store first time for replaying same cycle in loop
    // $scope.lineLabels.push(t0);
    //get histogram data
    //format data fiters    
    let time0 = $scope.filters.timeRange[0]
    time0 = time0.substring(0,2)+":"+time0.substring(2,4);
    let date0 = startDate;

    let time1 = $scope.filters.timeRange[1]
    time1 = time1.substring(0,2)+":"+time1.substring(2,4);
    let date1 = endDate;

    startDate = moment(date0+" "+time0);
    endDate = moment(date1+" "+time1);

    let args = {
      freq:$scope.filters.frequency,
      start:startDate.format(),
      end:endDate.format()
    };

    Historical.getHistogram(args)
    .then(function(res){
      // console.log(res.data.message);
      let data = res.data;
      $scope.histData = [];
      Object.keys(data).forEach(function(key){
        $scope.histData.push(data[key]);
      });
    },
    function(err){
      console.log(err);
    });
    
    Historical.getLineGraph(args)
    .then(function(res){
      // console.log(res.data.message);
      // let data = res.data;
      // $scope.lineData = [];

    },
    function(err){
      console.log(err);
    });

    //logic for interupting current polling loop to make new query.
    if(beginNext){
      beginNext = false;
      interupt = false;
      previousViewDates.push(t0);
      loopData(t0,dateStack.shift(),dateStack);
    }else{
      if(checkIfBusyInterval === undefined){
        checkIfBusyInterval = setInterval(function(){
          console.log("entering interval");
          if(beginNext){
            beginNext = false;
            interupt = false;
            previousViewDates.push(t0);
            clearInterval(checkIfBusyInterval);
            checkIfBusyInterval = undefined;
            loopData(t0,dateStack.shift(),dateStack);
          }
        },1e3);
      }
    }
  };


  function filterDateRange(event,picker){
    let startDate = event.model.startDate;
    startDate = moment(startDate.toString()).format();
    let index = startDate.indexOf('T');
    startDate = startDate.substring(0,index);

    let endDate = event.model.endDate;
    endDate = moment(endDate.toString()).format();

    index = endDate.indexOf('T');
    endDate = endDate.substring(0,index);

    let dateRange = "from:"+startDate+"-"+"to:"+endDate;
    if($scope.filters.dateRange.length === 0){
      $scope.filters.dateRange.push(startDate);
      $scope.filters.dateRange.push(endDate);
    }else{
      $scope.filters.dateRange = [];
      $scope.filters.dateRange.push(startDate);
      $scope.filters.dateRange.push(endDate);      
    }


    if($scope.filters.frequency !== 0 && 
       $scope.filters.timeRange.length !== 0){

      pollServer();
    }else{
      // console.log("picked date range: "+$scope.filters.dateRange[0]+
                // " to "+$scope.filters.dateRange[0]);
    }
  };

  function onApplyTimePicker(){
    let toTime = this.settings.time.toHour + this.settings.time.toMinute;
    let fromTime = this.settings.time.fromHour + this.settings.time.fromMinute;

    if($scope.filters.timeRange.length === 0){
      $scope.filters.timeRange.push(fromTime);
      $scope.filters.timeRange.push(toTime);
    }else{
      $scope.filters.timeRange = [];
      $scope.filters.timeRange.push(fromTime);
      $scope.filters.timeRange.push(toTime);      
    }

    if($scope.filters.frequency !== 0 && 
       $scope.filters.dateRange.length !== 0){

      pollServer();
    }else{
      // console.log(" fromTime:"+$scope.filters.timeRange[1]+'toTime:'+$scope.filters.timeRange[0]);
    }
  };

  function onClearTimePicker(){
    $scope.filters.timeRange = 0;
    // console.log("time range cancelled");
  };

  function filterFrequency(){
    $scope.filters.frequency = $scope.freqSlider.value;
    if($scope.filters.frequency !== 0 && 
       $scope.filters.dateRange.length !== 0){

      pollServer();
    }else{
      // console.log("filter frequency "+$scope.freqSlider.value);
    }
  };

  function filterSensor(id){
    let index = $scope.filters.sensors.indexOf(id);
    if(index !== -1){
      $scope.filters.sensors.splice(index,1);
    }else{
      $scope.filters.sensors.push(id);
    }

    // console.log("filter sensor "+id);
  };
});