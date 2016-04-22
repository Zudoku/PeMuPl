var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var database=require('./database.js');
var config = require('./config.js');

app.use(bodyParser.json());
app.post('/query/addtrack/', (req,res) => {

	var body = req.body;
	if(body.password == config.password && body.youtubeurl != undefined && body.trackname != undefined){
		database.addTrack(body);
		res.json({success: true});
	} else {
		res.json({success: false});
	}

});
app.use("/player/", express.static(__dirname + '/web'));


app.get('/query/tracks/', (req,res) => {
	Promise.all([
		database.getTrackList()

	]).then(function(data) {
		var response = {};
		response.tracks = data[0];
		
		res.json(response);
		
	}, (err) => {
    	console.log(`error: ${err}`)
    	res.json({error: 1});
	})
});



//Redirect / to /app/
app.get('/', function(req,res){
	res.redirect('/player/');
});


app.listen(config.webserver_port,config.webserver_bind);