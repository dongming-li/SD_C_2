var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017";
var classUtil = require('./ClassUtil');
 var url = "mongodb://10.36.97.34";
// var url = "mongodb://localhost:27017";

/*
returns the top 'num' trending classes in the database
trending is based off of the most likes in the past 'time' minutes
trending refers to classes that are getting a lot likes recently
callback will be formatted callback(topArr, nameArr, idArr)
where topArr is an array of the number of likes from low to high for the top 'num ' classes
classID is the associated array with the class ID's for the corresponding like array
*/
var getTrendingClasses = function getTrendingClasses(num,time, callback){
    MongoClient.connect(url, function(err, DB){
      if(err) throw err;

      var classCollection = DB.collection("Classes");
      classCollection.find({}).toArray(function(err, cursor){
        if(err) throw err;

        getRecentLikesForClasses(cursor,time, function(arr){
            //console.log(arr + " yo mama, heres recent likes");

              //array is sorted from low to high
              var topArr = new Array(num);
              var nameArr = new Array(num);
              var idArr = new Array(num);
              var profilePicArr = new Array(num);

              var picCounter = 0;
              for(var i = 0; i < arr.length; i = i + 4){
                var classID = arr[i];
                var name = arr[i + 1];
                var likes = arr[i+2];
                var profilePicString = null;

                updateArray(topArr, idArr, likes, classID, nameArr, name, profilePicArr, profilePicString);
              }

                // console.log(topArr);
        				// console.log(nameArr);
        				// console.log(idArr);
        				// console.log(profilePicArr);
                var teacherUsername = new Array();
                console.log(nameArr + " this is namaArr");
                for(var xx = 0; xx < nameArr.length; xx++){ //go through classes
                  for(xxx = 0; xxx < cursor.length; xxx++){ //go through names
                    if(cursor[xxx].name == nameArr[xx] ){
                      teacherUsername.push(cursor[xxx].teacherUsername);
                        //console.log("Adding " + cursor[xxx].teacherUsername);
                    }
                  }
                }
                //add all teacherUsername for trending classes to array

              //  console.log(teacherUsername + "This is the teacher useranme array");
                //console.log("This is the profilePIc aarr empty" + profilePicArr);
                getProfileStrings(teacherUsername, function(profilePicArr2){
                //  console.log("this is the profile pic string" + profilePicArr2);
                  //console.log("returning Trending classes");
                  callback(topArr, nameArr, idArr, profilePicArr2);
                  DB.close();

                });
              });

            });

        });

      };

      function getProfileStrings(teacherUsername, callback){
        MongoClient.connect(url, function(err, DB){
          if(err) throw err;
        //  console.log(teacherUsername);
          var profileCollection = DB.collection("Profiles");
          var returnArray = new Array();
          profileCollection.find({}).toArray(function(err, profilesDoc){
          //  console.log(profilesDoc);
          if(err) throw err;
              for(var i = 0; i < teacherUsername.length; i++){
                for(var x = 0; x < profilesDoc.length; x++){
                  if(profilesDoc[x].username == teacherUsername[i]){
                    //console.log("PPS " + profilesDoc[x].profilePicString);
                    if(profilesDoc[x].profilePicString.length > 2){
                      returnArray.push(profilesDoc[x].profilePicString);
                    }else{
                      returnArray.push(undefined);
                    }

                }
              }
            }
              callback(returnArray);
          });

        });
      }


// var profileUsernames = new Array();
// for(var x = 3; x < arr.length; x = x + 4){
//     profileUsernames.push(arr[x]);
// }


//returns array of classID followed by recent Likes
function getRecentLikesForClasses(classes, time, callback){
        var likesArray = [];
      //  console.log("HLPER METHOD TIME!!!");
      for(var i = 0; i < classes.length; i++){
        var tempClass = classes[i];
          classUtil.getRecentLikes(tempClass._id, time, i, function(recentLikes,x, tempClass2){ //ERROR HAPPENING HERE
            likesArray.push(tempClass2._id);
            likesArray.push(tempClass2.name); //console.log("class Name " + tempClass.name);
            likesArray.push(recentLikes);
            likesArray.push(tempClass2.teacherUsername);

            //console.log("Helper, likesArray: " + likesArray);
            if(x == classes.length-1){
              callback(likesArray);//ATTENTION may break shit
            }
          }, tempClass);
      }
}


/*
returns the top 'num' classes
callback will be formatted callback(likes, classID)
where likes is an array of the number of likes from low to high for the top 'num ' classes
classID is the associated array with the class ID's for the corresponding like array
*/
var getTopClasses = function getTopClasses(num, callback){
  MongoClient.connect(url, function(err, DB){
    if(err) throw err;

    var classCollection = DB.collection("Classes");
    classCollection.find({}).toArray(function(err, cursor){ //cursor is ALL CLASSES
      if(err) throw err;

        //array is sorted from low to high

        var topArr = new Array(num);
        var nameArr = new Array(num);
        var idArr = new Array(num);

        var profilePicArr = new Array(num);

        for(var i = 0; i < cursor.length; i++){
          var tempClassDoc = cursor[i];
          var likes = tempClassDoc.likes;
          var name = tempClassDoc.name;
          var classID = tempClassDoc._id;
          var profilePic;

          updateArray(topArr, idArr, likes,classID, nameArr, name, profilePicArr, profilePic); //likesArr, idArr, likes, classID, nameArr, name, profilePicArr, profilePic, callback
        }

        console.log(nameArr);
        var teacherUsernameArray = new Array();
        for(var i = 0; i < nameArr.length; i++){
          for(var x = 0; x < cursor.length; x++){
          //  console.log(nameArr[i]);
            //console.log(cursor[x].name);
            if(nameArr[i] == cursor[x].name){
              teacherUsernameArray.push(cursor[x].teacherUsername);
              console.log("teacher Username " + cursor[x].teacherUsername);
            }
          }
        }

        console.log("These are the teachers "+ teacherUsernameArray);
        getProfileStrings(teacherUsernameArray, function(strings){
          callback(topArr, nameArr, idArr, strings);
          DB.close();
        });



    });
  });
}

//arr is sorted from low to high
function updateArray(likesArr, idArr, likes, classID, nameArr, name, profilePicArr, profilePic, callback){
  //console.log("Current profilePicarr " + profilePicArr);
    for(var x = likesArr.length-1; x > -1 ; x-- ){

      if(likesArr[x] == undefined){ //if empty, fill in

        likesArr[x] = likes;
        idArr[x] = classID;
        if(nameArr != undefined){
          //console.log("Added " + name);
          nameArr[x] = name;
          profilePicArr = profilePic
        }
        break;
      }else{

        if(likesArr[x] < likes){ //else if arr value is greater th

          var currentLikes = likes;
          var currentID = classID;
          var currentName;
          var currentPic;


          var saveLikes;
          var saveID;
          var saveName;
          var savePic;

          if(name != undefined){
             currentName = name;
             currentPic = profilePic;
          }
        //  console.log("[MongoDB - MysteryFunction???] Sorting array");

          for(var y = x; y > -1; y--){

              //save current spot
                saveLikes = likesArr[y];
                saveID = idArr[y];
                if(name != undefined){
                  saveName = nameArr[y];
                  savePic = profilePicArr[y];
                }
                // console.log("Before the swap, likesArr " + likesArr);
                // console.log("Before the swap, idArr " + idArr);
                // console.log("Before the swap, nameArr " + nameArr);

              //swap
                likesArr[y] = currentLikes;
                idArr[y] = currentID;
                if(nameArr != undefined){
                  nameArr[y] = currentName;
                  profilePicArr[y] = currentPic;
                }
                // console.log();
                // console.log("After swap, likesArr " + likesArr);
                // console.log("After swap, idArr " + idArr);
                // console.log("After swap, nameArr " + nameArr);

              //new selected
                currentLikes = saveLikes;
                currentID = saveID;
                if(currentName != null){
                  currentName = saveName;
                  currentPic = savePic;
                }
          }
          break;
        }
      }
    //  console.log("Name arr !!!!!!!!!!!!!!!!!!!!!!!!!!!! "+ nameArr);
    //  console.log("id arr !!!!!!!!!!!!!!!!!!!!!!!!!!!! "+ idArr);
    //  console.log("likes arr !!!!!!!!!!!!!!!!!!!!!!!!!!!! "+ likesArr);

    }
}

//returns the  4 most recent classes
//array is sorted, id, name
var getRecentClasses = function getRecentClasses(callback){
        MongoClient.connect(url, function(err, DB){
          if(err) throw err;

          var classCollection = DB.collection("Classes");
          var topArr = new Array();
          var nameArr = new Array();
          var idArr = new Array();
          var profilePicArr = new Array();

          var teacherUsernameArray = new Array();
          classCollection.find({}).toArray(function(err, arr){

            for(var i = arr.length - 1; i > arr.length - 7; i--){
              topArr.push(arr[i].likes);
              nameArr.push(arr[i].name);
              idArr.push(arr[i]._id);
              teacherUsernameArray.push(arr[i].teacherUsername);
            }

            getProfileStrings(teacherUsernameArray, function(strings){
              DB.close();
              callback(topArr, nameArr, idArr, strings);
            });


          });
        });
};

var get4RandomClasses = function get3RandomClasses(callback){
  MongoClient.connect(url, function(err, DB){
    if(err) throw err;
    var classCollection = DB.collection("Classes");
  classCollection.find({}).toArray(function(err, arr){
        if(err) throw err;
        var usedNumsArray = new Array();
        var count = 0;
        while(count != 4){
          var rand =  Math.floor(Math.random() * arr.length);
          if(!usedNumsArray.includes(rand)){
            usedNumsArray.push(rand);
            count++;
          }
        }
      //  console.log("here are the random numbers" + usedNumsArray);
        var classArray = new Array();
        var teacherUsernameArray = new Array();
        for(var i = 0; i < 4; i++){
          classArray.push(arr[usedNumsArray[i]]);
          teacherUsernameArray.push(arr[usedNumsArray[i]].teacherUsername);
        //  console.log(arr[usedNumsArray[i]]);
        }
        var topArr = new Array();
        var nameArr = new Array();
        var idArr = new Array();
        var profilePicArr = new Array();

        for(var i = 0; i < 4; i++){
          topArr.push(classArray[i].likes);
          nameArr.push(classArray[i].name);
          idArr.push(classArray[i]._id);
        }

        getProfileStrings(teacherUsernameArray, function(strings){
          //for(var i = 0; i < strings.length; i++){
          //  console.log("These are the strings" + strings[i]);
          //  console.log();
          //}

          DB.close();
          callback(topArr, nameArr, idArr, strings);

        });
  });

});
}

var getAllCourses = function getAllCourses(callback){
  MongoClient.connect(url, function(err, DB){
    if(err) throw err;
    var classCollection = DB.collection("Classes");
      classCollection.find({}).toArray(function(err, arr){
        if(err) throw err;

      //  console.log("here are the random numbers" + usedNumsArray);
        var classArray = new Array();
        var teacherUsernameArray = new Array();
        for(var i = 0; i < arr.length; i++){
          classArray.push(arr[i]);
          teacherUsernameArray.push(arr[i].teacherUsername);
        //  console.log(arr[usedNumsArray[i]]);
        }
        //now have array of classes, and array of teacherUsernames

        var topArr = new Array();
        var nameArr = new Array();
        var idArr = new Array();
        var profilePicArr = new Array();

        for(var i = 0; i < arr.length; i++){
          topArr.push(classArray[i].likes);
          nameArr.push(classArray[i].name);
          idArr.push(classArray[i]._id);
        }

        getProfileStrings(teacherUsernameArray, function(strings){
          //for(var i = 0; i < strings.length; i++){
          //  console.log("These are the strings" + strings[i]);
          //  console.log();
          //}

          DB.close();
          callback(topArr, nameArr, idArr, strings);

        });
  });

});
};

var getAllUsers = function getAllUsers(callback){
  MongoClient.connect(url, function(err, DB){
    if(err) throw err;
    var profileCollection = DB.collection("Profiles");
      profileCollection.find({}).toArray(function(err, arr){
        if(err) throw err;

      //  console.log("here are the random numbers" + usedNumsArray);
        var nameArray = new Array();
        var base64Array = new Array();

        for(var i = 0; i < arr.length; i++){
              nameArray.push(arr[i].username);
              if(arr[i].profilePicString.length > 2){
                base64Array.push(arr[i].profilePicString);
              }else{
                base64Array.push(undefined);
              }
        }
          DB.close();
          callback(nameArray, base64Array);
        });
  });
};

var bigAnnouncement = function bigAnnouncement(teacherUsername, announcement){
  MongoClient.connect(url, function(err, DB){
    if(err) throw err;
    var profileCollection = DB.collection("Profiles");
      profileCollection.findOne({username: teacherUsername}, function(err, profileDoc){
        if(err) throw err;
            var classes = profileDoc.classesCreated;// array of classes created by teacher
            for(var i = 0; i < classes.length; i = i + 2){ //ATTENTION may cause problems
                  classUtil.addAnnouncements(classes[i].toString(), announcement);
            }
        });
  });
};

var searchClasses = function searchClasses(searchQuery, callback){
  MongoClient.connect(url, function(err, DB){
    if(err) throw err;
    var classCollection = DB.collection("Classes");
      classCollection.find({}).toArray(function(err, arr){
        if(err) throw err;

        var matchedClassesArr = new Array();
        for(var i = 0; i < arr.length; i++){
            if((arr[i].name).indexOf(searchQuery) !== -1){
              matchedClassesArr.push(arr[i]);
            }
        }

        var topArr = new Array();
        var nameArr = new Array();
        var idArr = new Array();

        var teacherUsernameArray = new Array();

        for(var i = 0; i < matchedClassesArr.length; i++){
          topArr.push(matchedClassesArr[i].likes);
          nameArr.push(matchedClassesArr[i].name);
          idArr.push(matchedClassesArr[i]._id);
          teacherUsernameArray.push(matchedClassesArr[i].teacherUsername);
          }

          getProfileStrings(teacherUsernameArray, function(strings){
            DB.close();
            callback(topArr, nameArr, idArr, strings);
          });

        DB.close();
      });
  });
}



exports.searchClasses = searchClasses;
exports.bigAnnouncement = bigAnnouncement;
exports.getAllUsers = getAllUsers;
exports.getAllCourses = getAllCourses;
exports.get4RandomClasses = get4RandomClasses;
exports.getRecentClasses = getRecentClasses;
exports.getTrendingClasses = getTrendingClasses;
exports.getTopClasses = getTopClasses;
