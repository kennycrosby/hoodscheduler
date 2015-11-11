// function sayHello() {
//     console.log('Hello my name is WHAAAAAAT');
// }
// sayHello();

var express = require('express');
var router = express.Router();
var Twit = require('twit');
var ig = require('instagram-node').instagram();
var Firebase = require('firebase');

var dataRef = new Firebase('https://hoodapp.firebaseio.com/testdata');

// Client IDs, Tokens, Secrets
var twConfig = {
    consumer_key: 'bhuMfuPGp0qQsKftVI4qrKKTx',
    consumer_secret: 'Mazcsq3gI1umrhY9HKAGGnrzgw0wRGPx3EJRqfBeR34PdzKysA',
    access_token: '874117766-4IIr0q9scRFiHkeoGIqfOr6FPm5jEkVVcHV6s6Py',
    access_token_secret: 'jHtJNMPKbqmpKvGBKnt4fEKJWfHRlK14OQK1QSl0OgOuU'
  };

 // Instagram Params
ig.use({ client_id: '05652b69ce2c4833a06f265f8de61d78',
         client_secret: 'bc9e8e3201db468e966aedf5b2d46c98' });



// instantiate Twit module
var twitter = new Twit(twConfig);

var USER_TIMELINE_URL = 'statuses/user_timeline';
var TWEET_COUNT = 25;
var USER = 'ddbsanfrancisco';

// Twitter params
var twParams = {
  screen_name: USER, // the user id passed in as part of the route
  count: TWEET_COUNT // how many tweets to return
};

var igParams = {
  count : 25
};

var todaysDate = new Date().setHours(0,0,0,0);
console.log('todays date', todaysDate);

var dataRef = new Firebase('https://hoodapp.firebaseio.com/testdata');
var todaysDateRef;

// see if todays date exists
dataRef.once('value', function(snapshot) {
  var dateSnapshot = snapshot.child(todaysDate).exists();
  if (dateSnapshot) {
    console.log('IT EXISTS ITS THERE OMG FUCK');
    todaysDateRef = dataRef.child(todaysDate);
    // clear it out
    todaysDateRef.remove();
    todaysDateRef = dataRef.child(todaysDate);
    getData();
  } else {
    // its not there so create it
    // dataRef.update(todaysDate);
    todaysDateRef = dataRef.child(todaysDate);
    getData();
  }
});

function getData() {

  // request data
  ig.user_media_recent('315641205', igParams, function(err, medias, pagination, remaining, limit) {

    // Save data
    var instagrams = medias,
        i = 0, len = instagrams.length;

    for(i; i < len; i++) { //iterate through tweets
      
      var instaDay = new Date(parseInt(instagrams[i].created_time) * 1000).setHours(0,0,0,0);
      console.log('current instagrams date without time', instaDay);

      if (todaysDate === instaDay) { // dates match
        console.log('WE HAVE A MATCH FOR INSTAGRAM');
        todaysDateRef.push(instagrams[i]);
      };
    }
  });

  // request data 
  twitter.get(USER_TIMELINE_URL, twParams, function (err, data, resp) {

    // save data
    var tweets = data,
        i = 0, len = tweets.length;

    for(i; i < len; i++) { //iterate through tweets
      
      var twitterDay = new Date( Date.parse(tweets[i].created_at) ).setHours(0,0,0,0);
      console.log('current twitter date without time', twitterDay);

      if (todaysDate === twitterDay) { // dates match
        console.log('WE HAVE A MATCH FOR TWITTER');
        todaysDateRef.push(tweets[i]);
      }
    }
  });
}