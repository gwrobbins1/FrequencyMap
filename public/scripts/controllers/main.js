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
  	  if($rootScope.intervalIDs === undefined){
  	  	$rootScope.intervalIDs = [];
  	  }else{
		  //stop polling server for data
		  if($rootScope.intervalIDs.length > 0){
		    $rootScope.intervalIDs.forEach(function(id){
		      clearInterval( $rootScope.intervalIDs[id] );
		    });
		    $rootScope.intervalIDs = [];
		  }
  	  }
  });
