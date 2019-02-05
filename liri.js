//Code to read and set any environment variables with the dotenv package
require('dotenv').config();

//Importing files needed to run the functions
var request = require("request");
var fs = require("fs");
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

//variables to capture user inputs
var userOption = process.argv[2];
var input = process.argv[3];

//Execute function
userInputs(userOption, input);

//Commands for liri
function userInputs (userOption, input) {
    switch (userOption) {
        case "concert-this":
            showConcertInfo(input);
            break;
        case "spotify-this-song":
            showSongInfo(input);
            break;
        case "movie-this":
            showMovieInfo(input);
            break;
        case "do-what-it-says":
            showSomeInfo();
            break;
        default:
            console.log("Invalid option, please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")            
    }
}

//Function for each LIRI Command

//Function for Concert Info: Bands in Town
function showConcertInfo(input){
    var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
        //if the request is successful
        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body);
            for (var i = 0; i < concerts.length; i++) {
                console.log("**********Event Info**********");
                console.log(i);
                console.log("Name of the Venue: " + concerts[i].venue.name);
                console.log("Venue Location: " + concerts[i].venue.city);
                console.log("Date of the Event: " + moment(concerts[i].datetime).format("MM/DD/YYYY"));
                console.log("*******************************");
            }
        }else{
            console.log('Error occurred.');
        }
    });}

    //Function for Music Info: Spotify
    function showSongInfo(input) {
        if (input === undefined) {
            input = "The Sign"; //default Song
        }
        spotify.search(
            {
                type: "track",
                query: input
            },
            function (err, data) {
                if (err) {
                    console.log("Error occurred: " + err);
                    return;
                }
                var songs = data.tracks.items;

                for (var i = 0; i < songs.length; i++) {
                    console.log("***********Song Info***********");
                    console.log(i);
                    console.log("Song name: " + songs[i].name);
                    console.log("Preview song: " + songs[i].preview_url);
                    console.log("Album: " + songs[i].album.name);
                    console.log("Artist(s): " + songs[i].artists[0].name);
                    console.log("*******************************");
                }
            }
        );
    };

    //Function for Movie Info: OMDB
    function showMovieInfo(input) {
        if (input === undefined) {
            input = "Mr. Nobody"
            console.log("----------------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + input + "&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            //If the request is successful
            if (!error && response.statusCode === 200) {
                var movies = JSON.parse(body);
                console.log("**********Movie Info***********");
                console.log("Title: " + movies.Title);
                console.log("Release Year: " + movies.Year);
                console.log("IMDB Rating: " + movies.imdbRating);
                console.log("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies));
                console.log("Country of Production: " + movies.Country);
                console.log("Language: " + movies.Language);
                console.log("Plot: " + movies.Plot);
                console.log("Actors: " + movies.Actors);
                console.log("********************************");
            }else{
                console.log('Error occurred.' + error);
            }
        });}

        //Function to get proper Rotten Tomatoes Rating
        function getRottenTomatoesRatingObject (data) {
            return data.Ratings.find(function (item) {
                return item.Source === "Rotten Tomatoes";
            });
        }
        function getRottenTomatoesRatingValue (data) {
            return getRottenTomatoesRatingObject(data).Value;
        }

        //Function for reading out of random.txt file
        function showSomeInfo(){
            fs.readFile('random.txt', 'utf8', function(err, data){
                if (err){
                    return console.log(err);
                }
            var dataArr = data.split(',');
            userInputs(dataArr[0], dataArr[1]);  
            });
        }