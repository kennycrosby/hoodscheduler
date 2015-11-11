var express = require('express');
var router = express.Router();
var Twit = require('twit');
var ig = require('instagram-node').instagram();
var config = require('../config');
var Firebase = require('firebase');

var dataRef = new Firebase('https://hoodapp.firebaseio.com/testdata');

// instantiate Twit module
var twitter = new Twit(config.twitter);

var USER_TIMELINE_URL = 'statuses/user_timeline';
var TWEET_COUNT = 25;
var USER = 'ddbsanfrancisco';

//ig.use({ access_token: 'YOUR_ACCESS_TOKEN' });
ig.use({ client_id: '05652b69ce2c4833a06f265f8de61d78',
         client_secret: 'bc9e8e3201db468e966aedf5b2d46c98' });

// var today = new Date();
// console.log('today without time', new Date().setHours(0,0,0,0));
// var todaysDate = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();

var todaysDate = new Date().setHours(0,0,0,0);

//var todaysDate = '10-31-2015';

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
  } else {
    // its not there so create it
    // dataRef.update(todaysDate);
    todaysDateRef = dataRef.child(todaysDate);
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('tweets', { title: 'Tweets' });

  var igParams = {
    count : 25
  };

  ig.user_media_recent('315641205', igParams, function(err, medias, pagination, remaining, limit) {

    // console.log('medias', medias.length);
    // console.log('err', err);
    // console.log('remaining', remaining);
    // console.log('pagination', pagination);
    // console.log('limit', limit);

    var instagrams = medias;

    var i = 0, len = instagrams.length;

    for(i; i < len; i++) {
      //iterate through tweets

      // var theDay = new Date(parseInt(instagrams[i].created_time) * 1000);
      // var formattedDate = (theDay.getMonth()+1) + '-' + theDay.getDate() + '-' + theDay.getFullYear(); 

      var instaDay = new Date(parseInt(instagrams[i].created_time) * 1000).setHours(0,0,0,0);
      console.log('current instagrams date without time', instaDay);

      if (todaysDate === instaDay) {
        console.log('match!!!');
        todaysDateRef.push(instagrams[i]);
      };

    }

  });

  var twParams = {
    screen_name: USER, // the user id passed in as part of the route
    count: TWEET_COUNT // how many tweets to return
  };

  // request data 
  twitter.get(USER_TIMELINE_URL, twParams, function (err, data, resp) {

    tweets = data;

    //console.log('data', data.length);

    var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      //iterate through tweets
      // var theDay = new Date( Date.parse(tweets[i].created_at) );
      // var formattedDate = (theDay.getMonth()+1) + '-' + theDay.getDate() + '-' + theDay.getFullYear(); 

      //console.log('current tweets date', formattedDate);
      
      var twitterDay = new Date( Date.parse(tweets[i].created_at) ).setHours(0,0,0,0);
      console.log('current twitter date without time', twitterDay);

      if (todaysDate === twitterDay) {
        console.log('TRUE YES SAME MATCH');
        todaysDateRef.push(tweets[i]);
      }
      
    }
  });

});

module.exports = router;


// Get the current day
// if that day exists in the database, clear it out
// if it does not exist, create it

// get 20 tweets, 
// save the day, 
// if they match up with that day, append them to the entry for that day overwrite all others that were in there for that day

// get 20 instagrams 
// save the day
// if they match up with that day, append them to that day 


// Check if those two are the same day
// print that day
// new Date(1446357625).setHours(0,0,0,0); 
// new Date(Date.parse("Mon Nov 09 17:59:54 +0000 2015")).setHours(0,0,0,0);

// moment(1445410800000).format('L');
