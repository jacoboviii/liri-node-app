require("dotenv").config();
const keys = require("./keys.js");
const request = require("request");
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const fs = require("fs");


const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);



// Action and values
const action = process.argv[2];
let value = process.argv.slice(3).join(", ")

function commands(action) {
    switch (action) {
        case "movie-this":
            movieThis();
            break;

        case "my-tweets":
            myTweets();
            break;

        case "spotify-this-song":
            spotifyThisSong();
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    };
}

// Function to get the movie data
function movieThis() {
    // If user does not input a movie, search for "Mr. Nobody"
    if (!value) {
        value = "Mr Nobody";
    }

    // console.log(`Default movie: ${value}`);

    // Then run a request to the OMDB API with the movie specified
    const queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site
            // First check to see if rotten tomatoes rating exists
            let tomatoesRating = "";
            if (JSON.parse(body).Ratings[1] === undefined) {
                tomatoesRating = "Not available"
            } else {
                tomatoesRating = JSON.parse(body).Ratings[1].Value;
            }

            console.log(`Title: ${JSON.parse(body).Title}`);
            console.log(`Year Released: ${JSON.parse(body).Released}`);
            console.log(`IMDB Rating: ${JSON.parse(body).imdbRating}`);
            console.log(`Rotten Tomatos Rating: ${tomatoesRating}`);
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actors: ${JSON.parse(body).Actors}`);
        }
    });
};

// Retrieve Tweets function.
function myTweets() {
    //get request parameters
    const params = { screen_name: 'aliastwitjacobo', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //Loop through the last 20 tweets
            tweets.forEach(tweet => {
                console.log(`Tweet: ${tweet.text}`);
                console.log(`Date created: ${tweet.created_at}`);
                console.log('-----------------------------------')
            });
        }
    });
};

// Get song from spotify function.

function spotifyThisSong() {
    // If user does not input a song, search for "the sign" by ace of base.
    if (!value) {
        value = "The sign Ace of Base";
    }

    spotify.search({ type: 'track', query: value, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`Artists: ${data.tracks.items[0].album.artists[0].name}`);
        console.log(`Song's name: ${data.tracks.items[0].name}`);
        console.log(`Preview link: ${data.tracks.items[0].preview_url}`);
        console.log(`Album name: ${data.tracks.items[0].album.name}`);
    });
}

function doWhatItSays() {
    // Read file
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        // Separate data into array
        data = data.split(",");

        // console.log(data);
        const randomAction = data[0];
        // Reassing value to the second element of the array
        value = data[1];

        // Call function
        commands(randomAction);
    });
}

// Call command to run function
commands(action);
