'use strict'
var config = require('./config.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(config.database_path);

/*

CREATE TABLE tracklist
(
added datetime,
trackname TEXT,
genre1 TEXT,
genre2 TEXT,
genre3 TEXT,
youtubeurl TEXT
);


*/

module.exports = {
	getTrackList : () => {
		return new Promise((resolve, reject) => {
			db.all("SELECT * FROM tracklist",function(err,rows){
				resolve(rows);
			})
		});
	},
	addTrack : (trackObject) => {
		db.run("INSERT INTO tracklist (added,trackname,genre1,genre2,genre3,youtubeurl) values (?,?,?,?,?,?)",
			[new Date(), trackObject.trackname, trackObject.genre1, trackObject.genre2, trackObject.genre3, trackObject.youtubeurl],function(err){

		});
	}

};