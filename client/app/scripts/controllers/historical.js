'use strict';

/**
 * @ngdoc function
 * @name frequencyMapApp.controller:LiveCtrl
 * @description
 * # LiveCtrl
 * Controller of the frequencyMapApp
 */
angular.module('frequencyMapApp')
  // .controller('LiveCtrl', function ($scope,$location) {
  	.controller('HistoricalCtrl', function ($scope) {
  		$scope.freqSlider = {
  			value:0,
  			options:{
  				floor:0,
  				ceil:1300,
  				step:0.5,
	  			minLimit:0,
	  			maxLimit:1300  				
  			}
  		};

  		//dumby sensors
  		$scope.sensors = [
  			{
  				name:'sensor-1',
  				location:'ucf',
  				isActive:true
  			},
  			{
  				name:'sensor-2',
  				location:'ucf',
  				isActive:true
  			},
  			{
  				name:'sensor-3',
  				location:'ucf',
  				isActive:true
  			}
  		];

  		$scope.submit = function(){
  			console.log('clicked submit');
  		};

  		$scope.reset = function(){
  			console.log('clicked reset');
  		};
  });
