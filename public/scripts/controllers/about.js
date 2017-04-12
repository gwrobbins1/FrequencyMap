'use strict';

/**
 * @ngdoc function
 * @name frequencyMapApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frequencyMapApp
 */
// angular.module('frequencyMapApp')
angular.module('AboutController',[])
  .controller('AboutCtrl', function ($rootScope) {
	  //stop polling server for data
	  if($rootScope.intervalIDs.length > 0){
	    $rootScope.intervalIDs.forEach(function(id){
	      clearInterval( id );
	    });
	    $rootScope.intervalIDs = [];
	  }   
  });
