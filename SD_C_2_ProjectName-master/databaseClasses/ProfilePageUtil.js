var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs'); //file system
var util = require('./ProfileUtil');

//var url = "mongodb://localhost:27017";
var url = "mongodb://10.36.97.34";



/**
 *
 * @param username
 * @param email
 * @param id
 */
var profilePageInformation = function profilePageInformation(username,email, id){
  this.username = username;
  this.email = email;
  this._id = id;
  this.classesCreated = [];
  this.school = "";
  this.dob = "";
  this.bio = "";
};


//Creates a profile page Information document in the database
var createProfilePageInformationDocument = function createProfilePageInformationDocument(username, email, id) {
    var ppi = new profilePageInformation(username,email,id);
    MongoClient.connect(url, function(err, DB){
      if(err) throw err;

      var collection = DB.collection("Profile Page Information");
      collection.insertOne(ppi);
      DB.close();
    });
};

//Universal 'mutator'
//What is property? WEll, ex. (username,email,school,bio,etc)
//data is the actual variable whose information is going to be store on the DB
var updateProfilePageInfo = function updateProfilePageInfo(username, property, data) {
    MongoClient.connect(url, function(err, DB){
      if(err) throw err;

      var query = {};
      query[property] =  data;
      var collection = DB.collection("Profile Page Information");
      collection.updateOne({username: username}, {$set: query}, function(){
        console.log("[MongoDB - updateProfilePageInfo]Updated " + property);
        DB.close();
      });
    });
};

//Universal 'Getter'
//returns profilePageInformation Object
var getProfilePageInformation = function getProfilePageInformation(username, callback){
  MongoClient.connect(url, function(err, DB){
    if(err) throw err;

    var collection = DB.collection("Profile Page Information");

    collection.findOne({username: username}, function(err, object){
      if(err) throw err;
      var temp = object;
      DB.close();
      callback(temp);
    });
  });
};

exports.updateProfilePageInfo = updateProfilePageInfo;
exports.getProfilePageInformation = getProfilePageInformation;
exports.createProfilePageInformationDocument = createProfilePageInformationDocument;
exports.profilePageInformation = profilePageInformation;
