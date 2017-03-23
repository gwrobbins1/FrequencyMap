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
		if(typeof $rootScope.intervalID !== 'undefined' ){
		    clearInterval( $rootScope.intervalID );
		    $rootScope.intervalID = undefined;
		}    
  });
