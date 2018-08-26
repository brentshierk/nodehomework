var keys = require('./keys.js')
var moment = require("moment")
var dotenv = require('dotenv').config()
var spotify = require('node-spotify-api')//spotify
var request = require('request')//ombd
var bandsInTown = require('bandsInTown')
var fs = require('fs')
arg1 = process.argv[2]
arg2 = process.argv[3]
//change inputs so its not just index 3 split?
var spotify = new spotify(keys.spotifyKeys);

switch (arg1) {
  case "bandsInTown": shows(arg2);
    break;
  case "spotifySong": spotify(arg2);
    break;
  case "searchMovie": movie(arg2);
      break;
    case "defult" :defult(arg2);
      break;


}



function spotify(arg2) {
  spotify.search({ type: 'track', query: arg2 }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  var songInfo = data.tracks.items
  console.log(songInfo[0].artists[0].name)
  console.log(song)
  console.log(songInfo[0].album.name)
  console.log(songInfo[0].preview_url)
});
};


function movie(arg2) {

	var queryUrl = "http://www.omdbapi.com/?t=" + arg2 + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {
		if (!arg2){
        	arg2 = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

function defult() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		var dataArr = data.split(",");

		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
		}  else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		}

  	});

};
function shows(arg2) {
  var queryURL = "https://rest.bandsintown.com/artists/" + arg2 + "/events?app_id=codingbootcamp";
  request(queryURL, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var eventInfo = JSON.parse(body)
      for (var i = 0; i < eventInfo.length; i++) {
        console.log("-----------------------")
        console.log(eventInfo[i].venue.name)
        console.log(eventInfo[i].venue.city + ", " + eventInfo[i].venue.region)
        console.log(moment(eventInfo[i].datetime).format("dddd, MMMM Do YYYY"))
        console.log("-----------------------")
      }
    }
  })
}
