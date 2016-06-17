var Cloudant = require('cloudant')
var cloudant = Cloudant("https://81a3a40c-22cc-49d8-aef6-ed134caffe07-bluemix:1e716025c3681fcb7bde2ac1deb0aeed93173428cf754c7e2f52234e1dea3b2c@81a3a40c-22cc-49d8-aef6-ed134caffe07-bluemix.cloudant.com");



module.exports = {
	
	readRecord: function(docId,callback) { 

	var db = cloudant.db.use("synonyms");
		db.get(docId, function(err, data) {
			if (err) callback (err,null);
			// if no err, callback with data
			callback(null, data);
		  });
	},
	
	getSynonymsByWord: function(word,callback) { 
		var db = cloudant.db.use("synonyms");
		var result = [];
		db.view('showWord', 'word',{ keys: [word] }, function(err, body) {
			if (err) callback (err,null);
			if (!err) {
				body.rows.forEach(function(doc) {
				  for(var attributename in doc.value){
						//console.log(attributename+": "+doc.value[attributename]);
						if (doc.value[attributename] != ""&& (attributename.indexOf("Syn") > -1)) {
							result.push(doc.value[attributename].trim());	
						}
					}	  
					  
				});
				callback(null, result);
			}
		});
	},
	
	getSingleSynonymByWord: function(word,callback) { 
		var db = cloudant.db.use("synonyms");
		var result = word;
		var resultLength = word.length;
		
		db.view('showWord', 'word',{ keys: [word] }, function(err, body) {
			if (err) callback (err,null);
			if (!err) {
				body.rows.forEach(function(doc) {
				  for(var attributename in doc.value){
						//console.log(attributename+": "+doc.value[attributename]);
						if (doc.value[attributename] != ""&& (attributename.indexOf("Syn") > -1) && doc.value[attributename].trim().length < resultLength) {
								resultLength = doc.value[attributename].trim().length;
								result = doc.value[attributename];
						}
					}	  
					  
				});
				callback(null, result);
			}
		});
	},
	
	stemmingAndGetShortestSynonym: function(word,callback) { 
		var db = cloudant.db.use("synonyms");
		var result = word;
		var resultLength = word.length;
		var stemmer = require('porter-stemmer').stemmer
		//console.log('Stemmed Word:', stemmer(word));
		db.view('showWord', 'word',{ keys: [stemmer(word)] }, function(err, body) {
			if (err) callback (err,null);
			if (!err) {
				body.rows.forEach(function(doc) {
				  for(var attributename in doc.value){
						//console.log(attributename+": "+doc.value[attributename]);
						if (doc.value[attributename] != ""&& (attributename.indexOf("Syn") > -1) && doc.value[attributename].trim().length < resultLength) {
								resultLength = doc.value[attributename].trim().length;
								result = doc.value[attributename];
						}
					}	  
					  
				});
				callback(null, result);
			}
		});
	},
	
	bagOfWordsGetSynonyms: function(words,callback) { 
		var wordsJson = words.words;
		var db = cloudant.db.use("synonyms");
		var finalResult = {"words": [] };
		var resultLength = wordsJson.length;
//console.log('resultLength: ', resultLength);
		var stemmer = require('porter-stemmer').stemmer
//console.log('Input Words: ', wordsJson);
		db.view('showWord', 'word',{ keys: wordsJson }, function(err, body) {
			if (err) callback (err,null);
			if (!err) {
				wordsJson.forEach(function(word) {
					var stemmedSingleWord = stemmer(word);
//console.log('stemmedSingleWord: ', stemmedSingleWord);		
					var singleResult = stemmedSingleWord;
					var resultLength = singleResult.length;
					body.rows.forEach(function(doc) {
						if (stemmedSingleWord == doc.value['Word']){
						  for(var attributename in doc.value){
								//console.log(attributename+": "+doc.value[attributename]);
								if (doc.value[attributename] != "" && (attributename.indexOf("Syn") > -1) && doc.value[attributename].trim().length < resultLength) {
										resultLength = doc.value[attributename].trim().length;
										singleResult = doc.value[attributename].trim();
								}
							}	  
						}
					});
				finalResult.words.push(singleResult);
				});
				callback(null, finalResult);
			}
		});
	}

};
