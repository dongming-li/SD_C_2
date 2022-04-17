var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var util = require('./ProfileUtil');

//var url = "mongodb://localhost:27017";
var url = "mongodb://10.36.97.34";


//teacher here should be owner of the classroom
function virtualClassroom(name, teacherUsername) {
    this.name = name; //name of classroom
    this.teacherUsername = teacherUsername; //owner of classroom
    this.studentArray = []; //students that are part of classRoom
    this.followerArray = [];
    this.fileArr = [];
    this.classDescription = "";
    this.gradeObjs = [];
    this.discussions = [];
    this.likes = 0;
    this.likeObjs = [];
    this.announcements = [];
}


function fileObject(base64String, fileName, fileType) {
    this.base64String = base64String;
    this.fileName = fileName;
    this.fileType = fileType;
}

function gradeObj(gradeName, gradeValueMax, dueDate) {
    this.gradeName = gradeName;
    this.gradeValueMax = gradeValueMax; //x total points for this grade
    this.dueDate = dueDate;
    this.studentGrades = [];
}

function studentGradeObj(username, gradeValue, submissionDate, isSubmitted, gradeName) {
    this.username = username;
    this.gradeValue = gradeValue;
    this.submissionDate = submissionDate;
    this.isSubmitted = isSubmitted;
    this.gradeName = gradeName;
}

function discussionObj(discussionName, username) {
    this.discussionName = discussionName;
    this.username = username;
    this.comments = [];
}

function comment(username, comment) {
    this.username = username;
    this.comment = comment;
}

function likeObj(username, date) {
    this.username = username;
    this.date = date;
}


//creates a new classroom AND updates teacher property of classes created
var createNewVirtualClassroom = function createNewVirtualClassroom(className, teacherUsername) { //ATTENTION make sure one user can't create 2 classrooms of same name
    var newClassRoom = new virtualClassroom(className, teacherUsername);
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        var classCollection = DB.collection("Classes");
        var profileCollection = DB.collection("Profiles");
        var PPU = DB.collection("Profile Page Information");

        classCollection.insertOne(newClassRoom, function (err) {
            if (err) throw err;

            classCollection.findOne({$and: [{name: className}, {teacherUsername: teacherUsername}]}, function (err, obj) {
                if (err) throw err;
                var classID = obj._id;
                profileCollection.updateOne({username: teacherUsername}, {$push: {classesCreated: classID}}, function (err, doc) {
                    if (err) throw err;
                    profileCollection.updateOne({username: teacherUsername}, {$push: {classesCreated: className}}, function (err, doc) {
                        if (err) throw err;
                        PPU.updateOne({username: teacherUsername}, {$push: {classesCreated: classID}}, function (err) {
                            if (err) throw err;
                            console.log("[MongoDB - createNewVirtualClassroom] Created a new virtualClassroom name " + className);
                            DB.close();
                        });
                    });

                });
            });
        });


    });
};

var getClassID = function getClassID(name, teacherUsername, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.findOne({$and: [{name: name}, {teacherUsername: teacherUsername}]}, function (err, obj) {
            if (err) throw err;

            DB.close();
            callback(obj._id);
        });
    });
};

//Returns a virtualClassroom object
//name & teacherUsername are optional
var getVirtualClassroom = function getVirtualClassroom(classID, callback, name, teacherUsername) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        if (name !== undefined && teacherUsername != undefined) {
            classCollection.findOne({$and: [{name: name}, {teacherUsername: teacherUsername}]}, function (err, classDoc) {
                if (err) throw err;

                DB.close();
                callback(classDoc._id);
            });
        } else {
            classCollection.findOne({_id: ObjectId(classID)}, function (err, classDoc) {
                if (err) throw err;
                DB.close();
                callback(classDoc);
            });
        }
    });
};

//students parameter must either be a variable containing 1 username
//or an array of student usernames if you wish to add more than 1 student.
var addStudentsToClass = function addStudentsToClass(students, classID) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var i;

        if (Array.isArray(students)) {
            for (i = 0; i < students.length; i++) {
                var username = students[i];
                addSGOsForOneStudent(username, classID);
            }
            console.log("[MongoDB - addStudentToClass] Added " + students.length + " students to the class");
        } else {
            addSGOsForOneStudent(students, classID);
        }
    });
};

//Add a new Student Grade Objec to a class
function addSGOsForOneStudent(studentsUsername, classID) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        var profileCollection = DB.collection("Profiles");
        util.getStudentProfile(studentsUsername, function (studentDoc) {
            //  console.log(studentDoc._id);
            var students = studentDoc._id;
            classCollection.updateOne({_id: ObjectId(classID)}, {$push: {studentArray: studentsUsername}}, function (err) {
                if (err) throw err;
                profileCollection.updateOne({_id: ObjectId(students)}, {$push: {classesJoined: classID}}, function (err) {
                    if (err) throw err;
                    getVirtualClassroom(classID, function (obj) {
                        profileCollection.updateOne({_id: ObjectId(students)}, {$push: {classesJoined: obj.name }}, function (err) {
                            if(err) throw err;
                    });
                        console.log("[MongoDB - addStudentToClass] Added student to class");

                        //var tempStudenGO = new studentGradeObj(doc.username,null,null, false);

                        classCollection.findOne({_id: ObjectId(classID)}, function (err, classDoc) {
                            if (err) throw err;


                            for (var i = 0; i < classDoc.gradeObjs.length; i++) {
                                var tempStudenGO = new studentGradeObj(studentDoc.username, null, null, false, classDoc.gradeObjs[i].gradeName);

                                var query = {};
                                var property = "gradeObjs.";
                                property = property + i + ".studentGrades";
                                query[property] = tempStudenGO;
                                classCollection.updateOne({_id: ObjectId(classID)}, {$push: query});
                            }
                            DB.close();
                        });
                    });
                });
            });
        });
    });
}

//removes a single student from a virtualClassroom
//If you wish to use username, enter, none , for ID argument.
var removeStudentFromClass = function removeStudentFromClass(studentID, classID) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        var profileCollection = DB.collection("Profiles");
        classCollection.updateOne({_id: ObjectId(classID)}, {$pull: {studentArray: studentID}});
        profileCollection.updateOne({_id: ObjectId(studentID)}, {$pull: {classesJoined: classID}});
        console.log("[MongoDB - removeStudentFromClass] Removed student from class");
        DB.close();
    });
};

//deletes a virtualClassroom
var deleteClass = function deleteClass(classID) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        var profileCollection = DB.collection("Profiles");

        classCollection.findOne({_id: ObjectId(classID)}, function (err, classDoc) {
            if (err) throw err;
            console.log("This is the classDocument" + classDoc);
            console.log();
            classCollection.deleteOne({_id: ObjectId(classID)}, function (err, doc) { //works
                if (err) throw err;
                console.log("[MongoDB - deleteClass] Deleted Class ");
                profileCollection.updateOne({username: classDoc.teacherUsername}, {$pull: {"classesCreated": ObjectId(classID)}}, function (err, doc) {
                    if (err) throw err;
                    console.log("[MongoDB - deleteClass] Updated Classes created for teacher " + classDoc.teacherUsername);
                    DB.close();
                });
            });
        });

    });
};

//stores base64 string of file in Classes collection
var storeClassFile = function storeClassFile(base64String, fileType, fileName, classID) {
    var fileObj = new fileObject(base64String, fileName, fileType);
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.updateOne({_id: ObjectId(classID)}, {$push: {fileArr: fileObj}});
        DB.close();
    });
};

//returns base64String of file
var getClassFile = function getClassFile(classID, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        var fileArr = new Array();
        classCollection.findOne({_id: ObjectId(classID)}, function (err, classDoc) {
            if (err) throw err;
            for (var i = 0; i < classDoc.fileArr.length; i++) {
                fileArr.push(classDoc.fileArr[i].base64String);
                fileArr.push(classDoc.fileArr[i].fileName);
                fileArr.push(classDoc.fileArr[i].fileType);
                console.log('[classUtil] ' + classDoc.fileArr[i].fileName);
            }
            DB.close();
            callback(fileArr);
        });
    });
};

//DOES NOT MODIFY ARRAYS
//Almost universal mutator
var changeClassProperty = function changeClassProperty(classID, property, value) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.updateOne({_id: classID}, {$set: {property: value}});
        console.log("[MongoDB - changeClassProperty] Update Class Property" + property);
        DB.close();
    });
};

//add a Grade Object ot a class
var addNewGradeObj = function addNewGradeObj(classID, gradeName, gradeMaxValue, dueDate, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var newGrade = new gradeObj(gradeName, gradeMaxValue, dueDate);
        var classCollection = DB.collection("Classes");
        classCollection.updateOne({_id: ObjectId(classID)}, {$push: {gradeObjs: newGrade}}, function (err, nogood) { //Add NewGradeObj
            if (err) throw err;
            classCollection.findOne({_id: ObjectId(classID)}, function (err, classDoc) { //Get classDocument
                if (err) throw err;

                var correctIndex = -1;
                for (var i = 0; i < classDoc.gradeObjs.length; i++) {//Find index of correct GradeObj in GradeObj array
                    if (classDoc.gradeObjs[i].gradeName == gradeName) {
                        correctIndex = i;
                        break;
                    }
                }
                if (correctIndex == -1) {
                    console.log("GradeObj NOT FOUND --- Exiting!");
                    return;
                }

                var IDarr = classDoc.studentArray; //array of StudentID's
                for (var i = 0; i < IDarr.length; i++) {
                    var id = IDarr[i];
                    getIDusername(id, function (doc) {
                        finishUp(doc, id, gradeName, classID);
                    });
                }
                console.log("Done Adding Grade Object");
                //Now have studentID's and studentUsernames
            });
        });
    });
};

function finishUp(studentUsername, ID, gradeName, classID) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        console.log("This is a username " + studentUsername);
        var classCollection = DB.collection("Classes");
        var tempSGO = new studentGradeObj(studentUsername, null, null, false);

        classCollection.updateOne({$and: [{_id: ObjectId(classID)}, {"gradeObjs.gradeName": gradeName}]}, {$push: {"gradeObjs.$.studentGrades": tempSGO}}, function (err) {
            if (err) throw err;
            console.log("[MongoDB - addNewGradeObj] Added new GradeObj, along with associated studentGradeObjs");
            DB.close();
        });
    });
}

//helper method, do not call
function getIDusername(ID, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Profiles");
        classCollection.findOne({_id: ObjectId(ID)}, function (err, doc) {
            callback(doc.username);
        });
    });
}


//use to update gradeObj name, maxValue, or dueDate
var updateGradeObj = function updateGradeObj(classID, gradeName, property, value) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        property = "gradeObjs.$." + property;
        var query = {};
        query[property] = value;
        var classCollection = DB.collection("Classes");
        classCollection.updateOne({$and: [{_id: ObjectId(classID)}, {"gradeObjs.gradeName": gradeName}]}, {$set: query});
        console.log("[MongoDB - updateGradeObj] Updated gradeObj named " + gradeName + " property: " + property + " to " + value);
        DB.close();
    });
};

//deletes 1 gradeObj
var deleteGradeObj = function deleteGradeObj(classID, gradeName) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.updateOne({_id: ObjectId(classID)}, {$pull: {"gradeObjs": {"gradeName": gradeName}}}, function (err, result) {
            if (err) throw err;

            console.log("[MongoDB - deleteGradeObj] Deleted GradeObj named: " + gradeName);
            DB.close();
        });

    });
};

//finds class with classID, finds the gradeObj with gradeName, then finds the studentGradeObj
//username = student username
var changeStudentGradeObj = function changeStudentGradeObj(classID, gradeName, username, value) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.findOne({_id: ObjectId(classID)}, function (err, thing) { //get class Doc
            if (err) throw err;

            for (var i = 0; i < thing.gradeObjs.length; i++) {
                console.log(thing.gradeObjs[i].gradeName);
                if (thing.gradeObjs[i].gradeName == gradeName) {
                    console.log("Inside the bunker");
                    for (var x = 0; x < thing.gradeObjs[i].studentGrades.length; x++) {
                        if (thing.gradeObjs[i].studentGrades[x].username == username) {
                            console.log("inside the rabbit hole");
                            changeStudentGradeObjHelper(classID, gradeName, username, value, i, x);
                        }
                    }
                }
            }
        });
    });
};

function changeStudentGradeObjHelper(classID, gradeName, username, value, gradeObjIndex, studentGradeIndex) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        console.log(gradeObjIndex + " is the gradeObjIndex");
        console.log(studentGradeIndex + " is the studentGradeIndex");
        var classCollection = DB.collection("Classes");

        var property = "gradeObjs." + gradeObjIndex + ".studentGrades." + studentGradeIndex + ".gradeValue";
        var query = {};
        query[property] = value;

        classCollection.updateOne({_id: ObjectId(classID)}, {$set: query}, function (err, thing) {
            if (err) throw err;
            console.log("[MongoDB changeStudentGradeObj] Changed studentGradeObj! huzzah!");
            DB.close();
        });
    });
}

//returns a studentGradeObj, see top of class for studentGradeObj outline
var getStudentGradeObj = function getStudentGradeObj(classID, username, gradeName, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.findOne({$and: [{_id: ObjectId(classID)}, {"gradeObjs.gradeName": gradeName}]}, function (err, doc) {
            if (err) throw err;

            var arr = doc.gradeObjs;
            for (var i = 0; i < arr.length; i++) {
                var temp = arr[i];
                if (temp.gradeName == gradeName) {
                    var studentGradeArr = temp.studentGrades;
                    for (var x = 0; x < studentGradeArr.length; x++) {
                        if (studentGradeArr[x].username == username) {
                            var name = studentGradeArr[x].username;
                            DB.close();
                            console.log("[MongoDB getStudentGradeObj] Found student!");
                            callback(studentGradeArr[x]);
                        }
                    }
                }
            }
            DB.close();

        });
    });
};

//Adds a studentGradeObj to a classes GradeObj array
var addStudentGradeObj = function addStudentGradeObj(classID, gradeName, username, gradeValue, submissionDate) {
    var temp = new studentGradeObj(username, gradeValue, submissionDate, gradeName);
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.updateOne({$and: [{_id: ObjectId(classID)}, {"gradeObjs.gradeName": gradeName}]}, {$push: {"gradeObjs.$.studentGrades": temp}}, function (err, classDoc) {
            if (err) throw err;
            console.log("[MongoDB - addStudentGradeObj] Added StudentGradeObj (hopefully!)");
            DB.close();
        });

    });
};

//Delets a student GradeObj.
var deleteStudentGradeObj = function deleteStudentGradeObj(classID, gradeName, username) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.updateOne({$and: [{_id: ObjectId(classID)}, {"gradeObjs.gradeName": gradeName}]}, {$pull: {"gradeObjs.$.studentGrades": {username: username}}});
        console.log("[MongoDB - deleteStudentGradeObj] Deleted StudentGradeObj");
        DB.close();
    });
};


//op = operation being performed, Types accepted("add", "remove", "get")
//add adds 1 student, remove removes 1 student, get returns all followers in an array
//Enter "null" in string format for callback if using "add" or "remove"!!!!!!!!!!!
var updateFollowers = function updateFollowers(op, classID, callback, studentID) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        var classCollection = DB.collection("Classes");
        if (op === "get") {
            classCollection.findOne({_id: ObjectId(classID)}, function (err, doc) {
                if (err) throw err;

                callback(doc.followerArray);
                console.log("[MongoDB updateFollowers] Returned array of followers. Lead wisely");
                DB.close();
            });
        } else {
            if (op === "add") {
                classCollection.updateOne({_id: ObjectId(classID)}, {$push: {followerArray: studentID}});
                console.log("[MongoDB updateFollowers] Added student to list of followers.");
                DB.close();
            } else if (op === "remove") {
                classCollection.updateOne({_id: ObjectId(classID)}, {$pull: {followerArray: studentID}});
                console.log("[MongoDB updateFollowers] Removed student from list of followers. :()");
                DB.close();
            } else {
                console.log("Invalid command op: " + op);
                DB.close();
            }
        }
    });
};

//creates a newDiscussion for the given classRoom
var beginDiscussion = function beginDiscussion(className, teacherUsername, discussionName) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var newDiscussion = new discussionObj(discussionName, teacherUsername);
        var classCollection = DB.collection("Classes");
        classCollection.updateOne({$and: [{name: className}, {teacherUsername: teacherUsername}]}, {$push: {discussions: newDiscussion}}, function (err) {
            if (err) throw err;

            console.log("[MongoDB - beginDiscussion] Created a New Discussion. Hi!");
            DB.close();
        });
    });
};

//Adds a comment to the disccuson named discussionName
var makeComment = function makeComment(className, teacherUsername, discussionName, username, commentString) {
    var newComment = new comment(username, commentString);
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        var classCollection = DB.collection("Classes");

        classCollection.updateOne({$and: [{name: className}, {teacherUsername: teacherUsername}, {"discussions.discussionName": discussionName}]}, {$push: {"discussions.$.comments": newComment}}, function (err) {
            if (err) throw err;

            console.log("[MongoDB - makeComment] Created a new comment. Comment has been corrected to adhere to current Ingsoc speech protocol v8.01");
            DB.close();
        });
    });
};

//returns a Discussion Object. See top of class for Discussion Object outline
var getDiscussion = function getDiscussion(className, teacherUsername, discussionName, callback) {

    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;
        var classCollection = DB.collection("Classes");

        classCollection.findOne({$and: [{name: className}, {teacherUsername: teacherUsername}]}, function (err, foundDoc) {
            if (err) throw err;

            var discussionArr = foundDoc.discussions;
            var discussionFound;
            for (var i = 0; i < discussionArr.length; i++) {
                if (discussionArr[i].discussionName == discussionName) {
                    discussionFound = discussionArr[i];
                    break;
                }
            }
            DB.close();
            console.log("[MongoDB - getDiscussion] Found Discussion");
            callback(discussionFound);

        });
    });
};

//ATTENTION add classNames to ID

//Have a user Like a class. If class has already been liked by user, nothing happens
var likeClass = function likeClass(username, classID, date) {
    var newLikeObj = new likeObj(username, date);

    classAlreadyLiked(username, classID, function (bool) {
        if (bool == false) {
            MongoClient.connect(url, function (err, DB) {
                if (err) throw err;

                var classCollection = DB.collection("Classes");
                var profileCollection = DB.collection("Profiles");
                getVirtualClassroom(classID, function (doc) {
                    classCollection.updateOne({_id: ObjectId(classID)}, {
                        $inc: {likes: 1},
                        $push: {likeObjs: newLikeObj}
                    }, function (err) {
                        if (err) throw err;

                        profileCollection.updateOne({username: username}, {$push: {classesLiked: classID}}, function (err) {
                            if (err) throw err;
                            profileCollection.updateOne({username: username}, {$push: {classesLiked: doc.name}}, function (err) {
                                if (err) throw err;
                                console.log("[MongoDB - likeClass] Liked class with ID " + classID + " by " + username + " on date " + date);

                                DB.close();
                            });

                        });
                    });
                });
            });
        } else {
            console.log("[MongoDB - likeClass] Class was already liked previously");
        }
    });
};

//Let user unlike a class. If class has not been liked previously, nothing happens
var unlikeClass = function unlikeClass(username, classID) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        var profileCollection = DB.collection("Profiles");

        classAlreadyLiked(username, classID, function (bool) {
            if (bool === true) {
                classCollection.updateOne({_id: ObjectId(classID)}, {
                    $inc: {likes: -1},
                    $pull: {likeObjs: {"username": username}}
                }, function (err) {
                    if (err) throw err;

                    console.log("[MongoDB - unlikeClass] Unliked class with ID " + classID + " by " + username);
                    profileCollection.updateOne({username: username}, {$pull: {classesLiked: classID}}, function () {
                        DB.close();
                    });
                });
            } else {
                console.log("[MongoDB - unlikeClass] Class was not liked previously");
                DB.close();
            }
        });

    });
};

//helper method, do not call
var classAlreadyLiked = function classAlreadyLiked(username, classID, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var profileCollection = DB.collection("Profiles");
        profileCollection.findOne({username: username}, function (err, doc) {
            if (err) throw err;
            var alreadyLiked = false;
            for (var i = 0; i < doc.classesLiked.length; i++) {
                if (doc.classesLiked[i] == classID) {
                    alreadyLiked = true;
                }
            }
            DB.close();
            callback(alreadyLiked);

        });
    });
};

//time is used to get ALL likes that have occured in the last 'time' minutes
var getRecentLikes = function getRecentLikes(classID, time, x, callback, tempClass) {
    var currentDate = new Date();
    var currentMinutes = (currentDate.getTime() / 1000) / 60;
    var recentLikes = 0;
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.findOne({_id: ObjectId(classID)}, function (err, doc) {
            if (err) throw err;

            var likeObjsArr = doc.likeObjs;
            if (likeObjsArr.length == 0) {
                callback(0, x, tempClass);
            } else {

                for (var i = likeObjsArr.length - 1; i >= 0; i--) {
                    var tempDate = likeObjsArr[i].date;
                    var tempMinutes = (tempDate.getTime() / 1000) / 60;
                    if (currentMinutes - tempMinutes <= time) {
                        recentLikes++;
                    } else {
                        DB.close();
                        callback(recentLikes, x, tempClass);
                        break;
                    }
                    if (i == 0) {
                        callback(recentLikes, x, tempClass);
                    }
                }
                DB.close();
            }
        });
    });
};

//name, value, gradeMax, date
var getAllGradesOneClass = function getAllGradesOneClass(username, classID, callback) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        getGradeHelper(username, classID, function (gradeNameArr, gradeValueArr) { //returns 2 arrays. One of gradeName, one of Grade Value
            console.log("[MongoDB - getAllGradesOneClass] Getting grades");
            callback(gradeNameArr, gradeValueArr);
            DB.close();
        });

    });
};

//Returns Arr of
function getGradeHelper(username, classID, callback) {
    var gradeNameArr = new Array();

    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        var classCollection = DB.collection("Classes");
        classCollection.findOne({_id: ObjectId(classID)}, function (err, classDoc) {
            if (err) throw err;
            var gradeObjects = classDoc.gradeObjs;

            for (var i = 0; i < gradeObjects.length; i++) { //loop through Grade Objects
                for (var x = 0; x < gradeObjects[i].studentGrades.length; x++) { //loop through SGO's
                    if (gradeObjects[i].studentGrades[x].username == username) {
                        gradeNameArr.push(gradeObjects[i].studentGrades[x].gradeName);
                        gradeNameArr.push(gradeObjects[i].studentGrades[x].gradeValue);
                        console.log("grade max " + gradeObjects[i].gradeValueMax);
                        gradeNameArr.push(gradeObjects[i].gradeValueMax);
                        gradeNameArr.push(gradeObjects[i].dueDate);
                    }
                }
            }

            //console.log(maxValueArr + "this is the max value array");
            callback(gradeNameArr);
            DB.close();
        });
    });
}

var addAnnouncements = function addAnnouncements(classID, announcement) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        classCollection = DB.collection("Classes");
        classCollection.updateOne({_id: ObjectId(classID)}, {$push: {announcements: announcement}}, function () {
            console.log("[MongoDB - addAnnouncements] Added a new announcement");
            DB.close();
        });
    });
};

var addDescription = function addDescription(classID, desc) {
    MongoClient.connect(url, function (err, DB) {
        if (err) throw err;

        classCollection = DB.collection("Classes");
        classCollection.updateOne({_id: ObjectId(classID)}, {$set: {classDescription: desc}}, function () {
            console.log("[MongoDB - addAnnouncements] Added a new announcement");
            DB.close();
        });
    });
};

//Discussions
exports.beginDiscussion = beginDiscussion;
exports.makeComment = makeComment;
exports.getDiscussion = getDiscussion;

//GRADES
exports.addNewGradeObj = addNewGradeObj;
exports.updateGradeObj = updateGradeObj;
exports.deleteGradeObj = deleteGradeObj;

exports.addStudentGradeObj = addStudentGradeObj;
exports.changeStudentGradeObj = changeStudentGradeObj;
exports.getStudentGradeObj = getStudentGradeObj;
exports.deleteStudentGradeObj = deleteStudentGradeObj;

exports.getAllGradesOneClass = getAllGradesOneClass;

//other utility functions
exports.addAnnouncements = addAnnouncements;
exports.addDescription = addDescription;
exports.updateFollowers = updateFollowers;
exports.changeClassProperty = changeClassProperty;
exports.getClassID = getClassID;
exports.getVirtualClassroom = getVirtualClassroom;
exports.createNewVirtualClassroom = createNewVirtualClassroom;
exports.addStudentsToClass = addStudentsToClass;
exports.removeStudentFromClass = removeStudentFromClass;
exports.deleteClass = deleteClass;
exports.storeClassFile = storeClassFile;
exports.getClassFile = getClassFile;
exports.likeClass = likeClass;
exports.unlikeClass = unlikeClass;
exports.getRecentLikes = getRecentLikes;
exports.classAlreadyLiked = classAlreadyLiked;
