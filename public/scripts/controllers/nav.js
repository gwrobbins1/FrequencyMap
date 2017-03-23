'use strict';

/**
 * @ngdoc function
 * @name frequencyMapApp.controller:NavCtrl
 * @description
 * # Navigation controller
 * Controller of the frequencyMapApp
 */
// angular.module('frequencyMapApp')
angular.module('NavController',[])
  .controller('NavCtrl', function ($scope, $rootScope, $location) {
  	$scope.isActive = function(viewLocation){//used to determin which tab is active  		
  		return viewLocation === $location.path();
  	};
  });
