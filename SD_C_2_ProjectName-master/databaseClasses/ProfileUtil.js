var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs'); //file system
var profilePageUtil = require('./ProfilePageUtil');

// var url = "mongodb://localhost:27017";
 var url = "mongodb://10.36.97.34";


//returns TRUE if profile added successfully, FALSE if profile NOT added.
var addProfile = function addProfile(username, password, email, firstName, lastName, account, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var success = false;
        var NewProfile = new Profile(username, password, email, firstName, lastName, account);
        profilePageUtil.createProfilePageInformationDocument(NewProfile.username, NewProfile.email, NewProfile._id);
        console.log("[MongoDB - addProfile] Adding profile!");
        var collection = db.collection("Profiles");
        collection.insert(NewProfile);
        console.log("[MongoDB - addProfile] Profile Added!");
        db.close();
        if (callback != undefined) {
            callback(true);
            return true;
        }
        return (true);
    });
};

//ATTENTION changing profile information or deleting a user should update classes

//Account here can be 3 things. "student", "teacher", "admin"
//if no account arg is provided, defaults to student profile.
var Profile = function Profile(username, password, email, firstName, lastName, account) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isStudent = false;
    this.isTeacher = false;
    this.isAdmin = false;
    this.classesJoined = []; //contains classID's
    this.classesCreated = []; //contains classID's
    this.classesLiked = [];
    this.accountActive = false;
    this.profilePicString = "";

    if (account != null) {
        if (account == "teacher") {
            this.isTeacher = true;
        }
        else if (account == "admin") {
            this.isAdmin = true;
        }
        else { //defaults to student account
            this.isStudent = true;
        }
    }
    else { //defaults to student account
        this.isStudent = true;
    }
};

//returns true if email OR username is found
//Deprecated by Sovann,
var doesUserExist = function doesUserExist(emailToCheck, username, callback) {
    var ProfileCollection;
    MongoClient.connect(url, function (err, DB) {
        ProfileCollection = DB.collection("Profiles");
        ProfileCollection.findOne({$or: [{email: emailToCheck}, {username: username}]}, function (err, document) {
            if (err) throw err;
            if (document == null) {
                console.log('[MongoDB - doesUserExist] User not found');
                callback(false);
            }
            else {
                console.log('[MongoDB - doesUserExist] Existing User Found');
                callback(true);
            }
        });
    });
};

//This methods use Profile EMAIL to see if Profile exists
//returns TRUE if email was changed, FALSE if not changed
//Deprecated by Sovann.
var changeEmail = function changeEmail(username, newEmail, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var collection = db.collection("Profiles");
        if (err) throw err;
        collection.updateOne({username: username}, {$set: {email: newEmail}});
        console.log("[MongoDB - changeEmail] Updated email");
        db.close();
        if (callback != undefined) {
            callback(true);
        }

    });
};

//Returns TRUE if school was updated. FALSE otherwise.
var changeSchool = function changeSchool(userEmail, username, userSchool, newSchool) {
    MongoClient.connect(url, function (err, DB) {
        var collection = DB.collection("Profiles");
        collection.updateOne({email: userEmail}, {$set: {School: newSchool}});
        console.log("[MongoDB - changeSchool] Updated School");
        DB.close();
        return true;
    });
};

//Returns TRUE if User was deleted, FALSE if user not deleted/user not found
var deleteUser = function deleteUser(userEmail, username, callback) {
    MongoClient.connect(url, function (err, DB) {
        var collection = DB.collection("Profiles");
        var PPIcollection = DB.collection("Profile Page Information");
        doesUserExist(userEmail, username, function (boolean) {
            if (boolean === "true") {
                collection.deleteOne({email: userEmail}, function(err){
                  if(err) throw err;
                  PPIcollection.deleteOne({email: userEmail}, function(err){
                    if(err) throw err;
                    console.log("[MongoDB - deleteUser] Deleted Profile");
                    DB.close();
                    callback(true);
                  });
                });
            }
            else {
                console.log("[MongoDB - deleteUser] Did NOT delete Profile");
                DB.close();
                callback(false);
            }
        });
    });

};

var changePassword = function changePassword(username, newPassword) {
    MongoClient.connect(url, function (err, DB) {
        var collection = DB.collection("Profiles");
        collection.updateOne({username: username}, {$set: {password: newPassword}});
        console.log("[MongoDB - changePassword] Changed Password");
    });
};

//Utility method for grabbing a student profile if desired
//returns Student Profile object, null if no profile found
var getStudentProfile = function getStudentProfile(username, callback) {
    MongoClient.connect(url, function (err, DB) {
        var collection = DB.collection("Profiles");
        collection.findOne({username: username}, function (err, profile) {
            if (err) throw err;
            DB.close();
            callback(profile);
        });
    });
};

//grabs a profile object using Profile ID
var getStudentProfileById = function getStudentProfileById(id, callback) {
    MongoClient.connect(url, function (err, DB) {
      if(err) throw err;
        var collection = DB.collection("Profiles");
        collection.findOne({_id: ObjectId(id)}, function (err, profile) {
            if (err) throw err;
            DB.close();
            callback(profile);
        });
    });
};

//checks if profile ID exists in the DB
var doesIDExist = function doesIDExist(ID, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        var collection = DB.collection("Profiles");

        collection.findOne({"_id": ObjectId(ID)}, function (err, doc) {
            if (err) throw err;
            if (doc) {
                DB.close();
                callback(true);
            } else {
                DB.close();
                callback(false);
            }
        });
    });
};

//Checks if profile is an educator
var isEducator = function isEducator(username, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var collection = DB.collection("Profiles");

        collection.findOne({$and: [{username: username}, {isTeacher: true}]}, function (err, doc) {
            if (err) throw err;
            if (doc) {
                DB.close();
                callback(true);

            } else {
                DB.close();
                callback(false);
            }
        });
    });
};

/**
 * Callback function parameter set to true if account activated && password matches username.
 * Otherwise callback function parameter will be set to false.
 *
 * @param username
 * @param password
 * @param callback
 *
 * Yes Jeff, I edited the function... love your greatest enemy.
 *Deprecated, love jeff
 */
var goodLogin = function goodLogin(username, password, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var profileCollection = DB.collection("Profiles");
        profileCollection.findOne({$and: [{username: username}, {password: password}, {accountActive: true}]},
            function (err, document) {
                if (err) throw err;
                DB.close();
                if (document != null) {
                    console.log("[Mongo - Login] CORRECT");
                    callback(true);
                } else {
                    console.log("[Mongo - Login] FALSE");
                    callback(false);
                }

            });
    });
};

//activates profile in DB
var activateAccount = function activateAccount(ID, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var profileCollection = DB.collection("Profiles");
        profileCollection.findOne({_id: ObjectId(ID)}, function (err, document) {
            if (err) throw err;

            if (document) {
                profileCollection.updateOne({_id: ObjectId(ID)}, {$set: {accountActive: true}});
                DB.close();
                callback(true);
            } else {
                DB.close();
                callback(false);
            }
        });
    });
};


//readFileSync
//decode to base64
//Buffer
var storeProfileImage = function storeProfileImage(imagePath, username, base64String) {
    MongoClient.connect(url, function (err, DB){
        if (err) throw err;
        console.log("FIRST FIRST FIRST");
        if(base64String != null){
            var collection = DB.collection("Profiles");
          collection.updateOne({username: username}, {$set: {profilePicString: base64String}});
          console.log("SECOND SECOND SECOND");
          console.log("[MongoDB - storeProfileImage] Added profilePicString");
        }else{
          var bitmap = fs.readFileSync(imagePath);
          // convert binary data to base64 encoded string
          var base64ProfilePicString = new Buffer(bitmap).toString('base64');
          var collection = DB.collection("Profiles");
          collection.updateOne({username: username}, {$set: {profilePicString: base64ProfilePicString}});
          console.log("[MongoDB - storeProfileImage] Added profilePicString");
        }
    });
};

//returns path to file
//path arg is where the profileImage will be written to
//Deprecated
var getProfileImage = function getProfileImage(username, origin, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        var collection = DB.collection("Profiles");
        if(origin == 1){
          collection.findOne({username: username}, function (err, profile) {
              if (err) throw err;
              if (profile != null) {
                  var base64String = profile.profilePicString;
                  DB.close();
                  callback(base64String);
              }
          });
        }else{
          collection.findOne({username: username}, function (err, profile) {
              if (err) throw err;
              if (profile != null) {
                  var base64String = profile.profilePicString;
                  const tempbuf = Buffer.from(base64String, 'base64');
                  fs.writeFileSync(__dirname + "/../views/img/" + username + ".jpg", tempbuf);
                  console.log("done");
                  DB.close();
                  callback("C:\\Users\\jeffy\Desktop\\309 Project\\SD_C_2_ProjectName\\Jeffrey_Yokup DB");
              }
          });
        }
    });
};


//POSSIBLY UNSTABLE, DO NOT TRUST AT ALL
var user_verification = function user_verification(password, username, callback) {
    var ProfileCollection;
    MongoClient.connect(url, function (err, DB) {
        ProfileCollection = DB.collection("Profiles");
        ProfileCollection.findOne({$and: [{password: password}, {username: username}]}, function (err, document) {
            if (err) throw err;
            if (document == null) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    });
};

//change Profile username
var changeUsername = function changeUsername(currentUsername, newUsername) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        var collection = DB.collection("Profiles");
        var PPIcollection = DB.collection("Profile Page Information");
        collection.updateOne({username: currentUsername}, {$set: {username: newUsername}}, function(err){
          if(err) throw err;

          PPIcollection.updateOne({username: currentUsername}, {$set: {username: newUsername}}, function(err){
            if(err) throw err;

            console.log("[MongoDB - changeUsername] Changed Username");
            DB.close();
          });
        });
    });
};


//newUserType must be entered as isStudent, isAdmin, isTeacher
//changes Type of user for profile
var changeUserType = function changeUserType(username, newUserType){
    MongoClient.connect(url, function(err, DB){
      if (err) throw err;
      var collection = DB.collection("Profiles");
      collection.updateOne({username: username}, {$set: {isStudent: false, isTeacher: false, isAdmin: false}}, function(err, status){
        if(err) throw err;

        var query = {};
        query[newUserType] = true;
        collection.updateOne({username: username}, {$set: query}, function(err, status){
          if(err) throw err;

          console.log("[MongoDB - changeUserType] Changed Usertype to " + newUserType);
          DB.close();
        });
      });

    });
};

exports.getStudentProfileById = getStudentProfileById;
exports.changeUserType = changeUserType;
exports.url = url;
exports.changeUsername = changeUsername;
exports.user_verification = user_verification;
exports.getProfileImage = getProfileImage;
exports.storeProfileImage = storeProfileImage;
exports.addProfile = addProfile;
exports.deleteUser = deleteUser;
exports.doesUserExist = doesUserExist;
exports.getStudentProfile = getStudentProfile;
exports.changeEmail = changeEmail;
exports.changeSchool = changeSchool;
exports.changePassword = changePassword;
exports.Profile = Profile;
exports.goodLogin = goodLogin;
exports.doesIDExist = doesIDExist;
exports.activateAccount = activateAccount;
exports.isEducator = isEducator;
