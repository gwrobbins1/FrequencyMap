'use strict';

/**
 * @ngdoc function
 * @name frequencyMapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frequencyMapApp
 */
// angular.module('frequencyMapApp')
angular.module('MainController',[])
  .controller('MainCtrl', function ($rootScope) {
	if(typeof $rootScope.intervalID !== 'undefined' ){
	    clearInterval( $rootScope.intervalID );
	    $rootScope.intervalID = undefined;
	}  	
  });
