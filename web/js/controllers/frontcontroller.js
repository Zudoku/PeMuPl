'use strict';

angular.module('pemupl.controller.front', [])
.controller('frontCtrl', ['$scope','$http','$location','$routeParams', function($scope, $http,$location,$routeParams) {

	/**
	* Fetches the songlist
	*/
	$scope.updateData = function(){
		var channelsResource = $http.get('/query/tracks/').success(function(data) {
	    	$scope.tracklist = data.tracks;
				$scope.applyfilters();
		});
	};
	//Initializes the youtube player
	$scope.initPlayer = function(){
		console.log("Initializing Youtube Player");
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}

	//Init it immediately
	$scope.initPlayer();


	//Loads next video in queue
	$scope.loadNextVideo = function(){

		$scope.tracksToPlay.splice(0,1);
		//$scope.$apply();
		if($scope.tracksToPlay.length > 0){
			$scope.playSong($scope.tracksToPlay[0]);
		}
	}

	//Setter to set the youtube player volume
	$scope.setVideoVolume = function(volume){
		window.player.setVolume(volume * 100);
	};

	var changeVolume = function(){
		var volume = $scope.volumebar.slider('getValue');
		$scope.setVideoVolume(volume);
	}


	//Setter to set the youtube player progress
	$scope.setVideoProgress = function(seconds){
		window.player.seekTo(seconds,true);

	};

	var changeProgress = function(){
		var progress = $scope.progressbar.slider('getValue');
		console.log("Skipping to " + progress);
		$scope.setVideoProgress(progress);
	}
	//Pauses or plays the video depending on the current state
	$scope.pausePlay = function(){
		if(window.player != undefined){
			if(window.player.getPlayerState() == 2){
				window.player.playVideo();
				$scope.playerSettings.paused = false;
			} else if(window.player.getPlayerState() == 1){
				window.player.pauseVideo();
				$scope.playerSettings.paused = true;
			} else if(window.player.getPlayerState() == -1){
				window.player.playVideo();
				$scope.playerSettings.paused = false;
			}
		}
	};
	//Plays the given track right now
	$scope.playSong = function(track){
		window.player.loadVideoById(track.youtubeurl, 0, "large");
		window.player.playVideo();
		$scope.playerSettings.currenttrack = track;
		console.log("Track name: " + track.trackname);
	};
	//Skips current song
	$scope.skip = function(){
		window.player.pauseVideo();
		$scope.loadNextVideo();

	};
	$scope.skipToSong = function(index){
		for(var x = 0; x < index; x++){
			$scope.skip();
		}
	}
	//Sets up the progress bar
	$scope.initPlayerSettings = function(){
		var videoLength = window.player.getDuration();
		$scope.playerSettings.trackLength = videoLength;
		console.log("Song length: " + videoLength);
		$scope.progressbar.slider('destroy');
		$scope.progressbar = $("#videoprogressbar").slider({
			tooltip: 'always',
			tooltip_position:'bottom',
			max : videoLength
		}).on('change',changeProgress);
		changeVolume();
	};
	//Updates the current song progress on the progressbar
	$scope.setPlayerSettings = function(){
		if(!$scope.playerSettings.started){
			return;
		}
		var timePassed = window.player.getCurrentTime();
		$scope.playerSettings.trackCurrentValue = timePassed;
		$scope.progressbar.slider('setValue', timePassed);
		//$scope.$apply();
	};
	//Applies the song filters to the song pool
	$scope.applyfilters = function(){
		var filterOptions = $scope.filterOptions;
		var filtered = [];

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
		$scope.filtered = filtered;

	}

	$scope.applyReshuffle = function(){
		//window.player.pauseVideo();
		var filtered = $scope.filtered.slice();


		if($scope.filterOptions.shuffle){
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
	//A function that gets called when the Start button gets pressed
	$scope.firstStart = function(){
		$scope.playerSettings.started = true;
		$scope.playerSettings.hideStart = true;
		console.log($scope.playerSettings);
		//$scope.$apply();
		$scope.applyReshuffle();
	};
	// Called after Youtube Player is initialized
	$scope.setCanStart = function(){
		$scope.playerSettings.hideStart = false;
		console.log("Youtube Player initialized!");
		$scope.$apply();
	};
	//Reset function for song filters
	$scope.resetFilters = function(){
		$scope.filterOptions = { genre1 : "No filter", genre2 : "No filter", genre3 : "song", shuffle : true};
		$scope.applyfilters();
	};


	$scope.tracksToPlay = {};
	$scope.filterOptions = { genre1 : "No filter", genre2 : "No filter", genre3 : "song", shuffle : true};
	$scope.playerSettings = { volume : 0.75, trackLength : 10, trackCurrentValue : 0, currenttrack : undefined, hideStart : true, started : false, paused : false};
	$scope.updateData();

	setInterval($scope.setPlayerSettings,1000);



	$scope.progressbar = $("#videoprogressbar").slider({
		tooltip: 'always',
		tooltip_position:'bottom',
		max : 10
	});
	$scope.volumebar = $("#volumebar").slider({
		tooltip_position:'bottom'
	}).on('slide',changeVolume);

} ]);
