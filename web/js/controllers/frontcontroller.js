'use strict';

angular.module('pemupl.controller.front', [])
.controller('frontCtrl', ['$scope','$http','$location','$routeParams', function($scope, $http,$location,$routeParams) {

	$scope.updateData = function(){
		var channelsResource = $http.get('/query/tracks/').success(function(data) {
	    	$scope.tracklist = data.tracks;
		});
	};

	$scope.trackIfPlayerStopped = function(){
		if(window.player != undefined && window.player.getPlayerState() == 0){
			//Load next video
			$scope.tracksToPlay.splice(0,1);
			$scope.$apply();
			if($scope.tracksToPlay.length > 0){
				$scope.playSong($scope.tracksToPlay[0]);
			}
			
		}

	};

	$scope.pausePlay = function(){
		if(window.player != undefined){
			if(window.player.getPlayerState() == 2){
				window.player.playVideo();
			} else if(window.player.getPlayerState() == 1){
				window.player.pauseVideo();
			} else if(window.player.getPlayerState() == -1){
				window.player.playVideo();
			}
		}
	};

	$scope.playSong = function(track){
		window.player.loadVideoById(track.youtubeurl, 0, "large");
		window.player.playVideo();
	};

	$scope.skip = function(){
		window.player.pauseVideo();
		//Load next video
		$scope.tracksToPlay.splice(0,1);
		
		if($scope.tracksToPlay.length > 0){

			$scope.playSong($scope.tracksToPlay[0]);
		}

	};

	$scope.applyReshuffle = function(){
		window.player.pauseVideo();
		var filtered = [];
		var filterOptions = $scope.filterOptions;

		function checkIfMatch(element, index, array) {
 			var trackname = element.trackname.toLowerCase();
 			var searchTerm = filterOptions.search.toLowerCase();

 			if(trackname.includes(searchTerm)){
 				filtered.push(element);
 			}
		}

		if(filterOptions.search != undefined && filterOptions.search != ""){
			$scope.tracklist.forEach(checkIfMatch);
		} else {
			filtered = $scope.tracklist.slice();
		}
		//Filter out by genre
		if(filterOptions.genre1 == "No filter"){

		} else if(filterOptions.genre1 == "all edm (includes subgenres)"){
			var edmGenres = ["generic house","deep house", "future house","bounce","electro","other edm", "glitch hop"];
			filtered = filtered.filter(function(x) {
				if(edmGenres.indexOf(x.genre1) != -1){
					return true;
				}
				return false;
			});

		} else if(filterOptions.genre1 == "House (includes subgenres)"){
			var houseGenres = ["generic house","deep house", "future house"];
			filtered = filtered.filter(function(x) {
				if(houseGenres.indexOf(x.genre1) != -1){
					return true;
				}
				return false;
			});
		} else {
			filtered = filtered.filter(function(x) {
				if(x.genre1 == filterOptions.genre1){
					return true;
				}
				return false;
			});
		}


		//Filter out by mood
		if(filterOptions.genre2 == "No filter"){

		} else {
			filtered = filtered.filter(function(x) {
				if(x.genre2 == filterOptions.genre2){
					return true;
				}
				return false;
			});
		}


		//Filter out by type
		if(filterOptions.genre3 == "No filter"){

		} else {
			filtered = filtered.filter(function(x) {
				if(x.genre3 == filterOptions.genre3){
					return true;
				}
				return false;
			});
		}

		if(filterOptions.shuffle){
			var finalOutPut = [];
			var times = filtered.length;

			for(var index = 0 ; index < times ; index++){
				var min = 0;
				var max = filtered.length;
				var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
				var result = filtered.splice(randomIndex -1,1);
				finalOutPut = finalOutPut.concat(result);
			}
			$scope.tracksToPlay = finalOutPut;

		} else {
			$scope.tracksToPlay = filtered.reverse();

		}
		$scope.playSong($scope.tracksToPlay[0]);
	};


	$scope.tracksToPlay = {};
	$scope.filterOptions = { genre1 : "No filter", genre2 : "No filter", genre3 : "No filter", shuffle : true};
	$scope.updateData();
	setInterval($scope.trackIfPlayerStopped,1000);

} ]);