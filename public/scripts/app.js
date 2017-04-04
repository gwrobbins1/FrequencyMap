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
    'ngAria',
    'ngMaterial',
    'ngMessages',
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
