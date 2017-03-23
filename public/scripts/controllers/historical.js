'use strict';

/**
 * @ngdoc function
 * @name frequencyMapApp.controller:LiveCtrl
 * @description
 * # LiveCtrl
 * Controller of the frequencyMapApp
 */
// angular.module('frequencyMapApp')
angular.module('HistoricalController',[])
  	.controller('HistoricalCtrl', function ($scope,$rootScope) {
  		$scope.freqSlider = {
  			value:0,
  			options:{
  				floor:0,
  				ceil:1300,
  				step:0.5,
	  			minLimit:0,
	  			maxLimit:1700  				
  			}
  		};
      if(typeof $rootScope.intervalID !== 'undefined' ){
          clearInterval( $rootScope.intervalID );
          $rootScope.intervalID = undefined;
      }

  		$scope.submit = function(){
  			console.log('clicked submit');
  		};

  		$scope.reset = function(){
  			console.log('clicked reset');
  		};
  });
