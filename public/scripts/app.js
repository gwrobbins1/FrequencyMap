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
    'wingify.timePicker',
    'daterangepicker',
    'ngAnimate',
    'ngRoute',
    'rzModule',
    'LiveService',
    'LiveController',
    'AboutController',
    'HistoricalService',
    'HistoricalController',
    'MainController',
    'NavController',
    'app.routes'
  ]);