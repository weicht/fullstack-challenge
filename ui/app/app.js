'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngCookies',
    'myApp.main',
    'myApp.login',
    'myApp.dashboard',
    'myApp.contacts',
    'myApp.restService',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.selection'
]).

//to use underscore in the app we need this...
constant('_', window._).
run(function ($rootScope) {
    $rootScope._ = window._;
}).

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
