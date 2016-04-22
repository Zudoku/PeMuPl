'use strict';

angular.module('pemupl.controller.addtrack', [])
.controller('addtrackCtrl', ['$scope','$http','$location','$routeParams', function($scope, $http,$location,$routeParams) {

	$scope.postTrack = function(){



		var channelsResource = $http.post('/query/addtrack/',$scope.newTrack).success(function(data) {
	    	if(data.success){
	    		$scope.newTrack = {};
	    	}
		});
	};
	
	
	$scope.newTrack = {};

} ]);