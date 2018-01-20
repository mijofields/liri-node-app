require("dotenv").config();  //dotenv configure
var Twitter = require('twitter'); //twitter API
var Spotify = require('node-spotify-api'); // Spotify API
var request = require('request'); // request
var keys = require("./keys.js") //keys info
var fs = require('fs'); //file system
var moment = require('moment'); // moment
var now = moment().format("MMMM Do YYYY, H:mm:ss"); //immutable = good times
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

console.log(client);

var action = process.argv[2];
var subjectArr = []; //allow for mutli word subjects to be return as the searches require

for (var i = 3 ; i < process.argv.length; i++ ) { // start from after the commands 

subjectArr.push(process.argv[i]);

}; //end of for loop

var query = subjectArr.join("+");


function switchAction (action, query) {

switch (action) {
  case "my-tweets":
    twitter();
    break;

  case "spotify-this-song":

  	if (query) {

  		song(query);  //if a search query is entered complete the search on the parameter
  		break;

  	} else {


  		song("The Sign");  //if no search query is entered return a search on The Sign
  		break;

  	};   
    

  case "movie-this":

  	if (query) {

  		movie(query);
  		break;

  	} else {

  		movie('Mr. Nobody');
  		break;

  	};
    

  case "do-what-it-says":
    random();
    break;

  
  default:
  console.log("Please enter a valid command, either:");
  console.log("'movie-this' <movie name>");
  console.log("'spotify-this-song' <song name>");
  console.log("'my-tweets'");
  console.log("'do-what-it-says'");
  console.log("-----------------------");
  break; 


				}; //end of switch
        } //end of swithAction function



function movie (query) {


	request("http://www.omdbapi.com/?t="+ query + "&plot=short&apikey=5ada800f", function(error, response, body) {


  if (!error) {

    console.log(JSON.parse(body).Title);

    console.log("Released on " + JSON.parse(body).Released);

    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);

    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);

    console.log("Produced in " + JSON.parse(body).Country);

    console.log("Language: " + JSON.parse(body).Language);

    console.log("Actors: " + JSON.parse(body).Actors);

    console.log(JSON.parse(body).Plot);

    console.log("-------------------------------------------");


      dataToAdd = JSON.parse(body).Title + '\n' + "Released on " + JSON.parse(body).Released + '\n' + "IMDB Rating: " + JSON.parse(body).Ratings[0].Value + '\n'
      + "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + '\n' + "Produced in " + JSON.parse(body).Country + '\n' + "Language: " + JSON.parse(body).Language + '\n'
      + "Actors: " + JSON.parse(body).Actors + '\n' + JSON.parse(body).Plot + '\n' + now + '\n' + "-------------------------------------------" + '\n';


      fs.appendFile('lirilog.txt', dataToAdd, function(err) {

  // If an error was experienced we say it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Content Added" to our node console.
  else {
    console.log("Content Added to Log File!");
  }

});





} else {


console.log("There was an error with your choice, please try again...");
dataToAdd = "There was an error with your choice, please try again...";

fs.appendFile('lirilog.txt', dataToAdd, function(err) {

  // If an error was experienced we say it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Content Added" to our node console.
  else {
    console.log("Error Added to Log File!");
  }

});



}; // end of else

}); //end of request

}; //end of movie



function song (query) {



spotify.search({ type: 'track', query:query }, function(err, data) {
  if (err) {

    return console.log('Error occurred: ' + err);
    dataToAdd = 'Error occurred: ' + err;
    fs.appendFile('lirilog.txt', dataToAdd, function(err) {

  // If an error was experienced we say it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Content Added" to our node console.
  else {
    console.log("Error Added to Log File!");
  }

});



  }

    contentAdd = false; //stop content notification repeating

    for(var i = 0; i < data.tracks.items.length; i++){


        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");


        dataToAdd = "Artist: " + songData.artists[0].name + '\n' + "Song: " + songData.name + '\n' + "Preview URL: " + songData.preview_url + '\n'
        + "Album: " + songData.album.name + '\n' + "-----------------------" + '\n' + now + '\n';

        fs.appendFile('lirilog.txt', dataToAdd, function(err) {

  // If an error was experienced we say it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Content Added" to our node console.
  else if (contentAdd === false) {

    console.log("Content Added to Log File!");
    contentAdd = true;
    //so this notification only comes once

  } else {
 
 //do nothing

  }

});

    } //end of for



});





}; //end of song


function twitter () {


  contentAdd = false;

  var params = {screen_name: 'cryplife101'};


  	client.get('statuses/user_timeline', params, function(error, tweets, response){

    if(!error){

      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@cryplife101: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");


        dataToAdd = "@cryplife101: " + tweets[i].text + " Created At: " + date.substring(0, 19) + '\n' + now + '\n' +  "-----------------------" + '\n';

        fs.appendFile('lirilog.txt', dataToAdd, function(err) {

  // If an error was experienced we say it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Content Added" to our node console.
  else if (contentAdd === false) {

    console.log("Content Added to Log File!");
    contentAdd = true;
    //so this notification only comes once

  } else {
 
 //do nothing

  }

});


}//end of for loop

} else { 


console.log("Sorry, there was an error");
console.log(JSON.stringify(error));


};

}); //end of get
	





}; //end of twitter



function random ()  {

fs.readFile('random.txt', "utf8", function(error, data){

if(error) {

console.log(error);

} else {

// console.log(data);
var random = data.split(',');
// console.log(random);

switchAction(random[0], random[1]);

// console.log("$ node liri.js " + random[0] + " " +  random[1]);




}; //end of else


    




}); //end of readfile

}; //end of random




function fileWork (one, two){


switchAction(one, two);



};



switchAction(action, query);