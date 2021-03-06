angular.module("app.routes", ["ngRoute"])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/pages/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/live',{
        templateUrl: 'views/pages/live.html',
        controller: 'LiveCtrl',
        controllerAs: 'live'
      })   
      .when('/live/sensors',{
        templateUrl: 'views/pages/live.html',
        controller: 'LiveCtrl',
        controllerAs: 'live'
      })
      .when('/live/readings',{
        templateUrl: 'views/pages/live.html',
        controller: 'LiveCtrl',
        controllerAs: 'live'
      })      
      .when('/historical',{
        templateUrl: 'views/pages/historical.html',
        controller: 'HistoricalCtrl',
        controllerAs: 'historical'
      })
      .when('/historical/readings',{
        templateUrl: 'views/pages/historical.html',
        controller: 'HistoricalCtrl',
        controllerAs: 'historical'
      })
      .when('/historical/histogram',{
        templateUrl: 'views/pages/historical.html',
        controller: 'HistoricalCtrl',
        controllerAs: 'historical'        
      })
      .when('/historical/linegraph',{
        templateUrl: 'views/pages/historical.html',
        controller: 'HistoricalCtrl',
        controllerAs: 'historical'        
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);//removes the requirment to have # in url
  });