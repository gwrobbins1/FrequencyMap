'use strict';

/**
 * @ngdoc overview
 * @name frequencyMapApp
 * @description
 * # frequencyMapApp
 *
 * Main module of the application.
 */
angular
  .module('frequencyMapApp', [
    'ngAnimate',
    'ngRoute',
    'rzModule',
    'LiveService',
    'LiveController',
    'AboutController',
    'HistoricalController',
    'MainController',
    'NavController',
    'app.routes'
  ]);
