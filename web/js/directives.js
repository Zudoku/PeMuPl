'use strict';

/* Directives */


angular.module('pemupl.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
    
  }]);
