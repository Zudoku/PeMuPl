'use strict';


// Declare app level module which depends on filters, and services
angular.module('pemupl', [
  'ngRoute',
  'pemupl.controllers',
  'pemupl.filters',
  'pemupl.services',
  'pemupl.directives',
]).config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/index', {templateUrl: 'html/front.html', controller: 'frontCtrl'});
  $routeProvider.when('/addtrack', {templateUrl: 'html/addtrack.html', controller: 'addtrackCtrl'});

  //FRONT PAGE
  $routeProvider.otherwise({templateUrl: 'html/front.html', controller: 'frontCtrl'});
}]);
 