/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

//get script that handles Cloudant operations
var cloudantOps = require('./cloudantOps.js');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

//define the path for the word synonyms extraction
app.all('/synonymsbyid/:id', function (req, res, next) {
	var docId = req.params.id || "da86e758ec7425f011e69e13d2fadc77";
	cloudantOps.readRecord (docId,function(err, data) {
	  if (err) throw err; // Check for the error and throw if it exists.
	  res.send(data);
	  //console.log('Result', data);
	});
});

//define the path for the word synonyms extraction
app.all('/synonymsbyword/:word', function (req, res, next) {
	var word = req.params.word || "unknown";
	cloudantOps.getSynonymsByWord (word,function(err, data) {
	  if (err) throw err; // Check for the error and throw if it exists.
	  res.send(data);
	  //console.log('Result', data);
	});
});

//define the path for the word synonyms extraction
app.all('/getSingleSynonymByWord/:word', function (req, res, next) {
	var word = req.params.word || "unknown";
	cloudantOps.getSingleSynonymByWord (word,function(err, data) {
	  if (err) throw err; // Check for the error and throw if it exists.
	  res.send(data);
	  //console.log('Result', data);
	});
});

//define the path for the word synonyms extraction
app.all('/stemmingAndGetShortestSynonym/:word', function (req, res, next) {
	var word = req.params.word || "unknown";
	cloudantOps.stemmingAndGetShortestSynonym (word,function(err, data) {
	  if (err) throw err; // Check for the error and throw if it exists.
	  res.send(data);
	  //console.log('Result', data);
	});
});

//define the path for the word synonyms extraction
app.all('/bagOfWordsGetSynonyms/', function (req, res, next) {
	var words = req.param('words') || { "words": ["cold", "greatness" ] };
	cloudantOps.bagOfWordsGetSynonyms (words,function(err, data) {
	  if (err) throw err; // Check for the error and throw if it exists.
	  res.send(data);
	  //console.log('Result', data);
	});
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
