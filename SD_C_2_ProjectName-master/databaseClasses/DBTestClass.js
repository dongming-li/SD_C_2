var util = require('./ProfileUtil')
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var profilePageUtil = require('./ProfilePageUtil');
var classUtil = require('./ClassUtil');
var trendingUtil = require('./trendingClassesUtil');

//var url = "mongodb://localhost:27017"; //JMASTERDB is Main Database Name
var url = "mongodb://10.36.97.34";

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
		console.log("Connected to Jeff's Awesome Database. All Welcome. Except DragonBorn.");


	//	trendingUtil.bigAnnouncement("SadDad.com", "this just in, League causes cancer");

		trendingUtil.searchClasses(" ", function(topArr, nameArr, idArr, profilePicArr){
				for(var i = 0; i < topArr.length; i++){
			console.log(topArr[i]);
			 		console.log(nameArr[i]);
			 		console.log(idArr[i]);
			 		console.log(profilePicArr[i]);
				}
		});
	});





	// trendingUtil.getTrendingClasses(3, 300, function(topArr, nameArr, idArr, profilePicArr){
	// 	for(var i = 0; i < topArr.length; i++){
	// 		console.log(topArr[i]);
	// 		console.log(nameArr[i]);
	// 		console.log(idArr[i]);
	// 		console.log(profilePicArr[i]);
	// }

	// trendingUtil.getAllCourses(function(topArr, nameArr, idArr, profilePicArr){
	// 		for(var i = 0; i < topArr.length; i++){
	// 			console.log(topArr[i]);
	// 			console.log(nameArr[i]);
	// 			console.log(idArr[i]);
	// 	 		console.log(profilePicArr[i]);
	//
	// 	}
	// 	console.log("DOne");
	// });

// MongoClient.connect(url, function(err, DB){
// 	if(err) throw err;
//
// 	var classCollection = DB.collection("Classes");
// 	classCollection.find({}).toArray(function(err, cursor){
// 		if(err) throw err;
//
// 		getRecentLikesForClasses(cursor,time, function(arr){
// 				//console.log(arr + " yo mama, heres recent likes");
//
//
// 					//array is sorted from low to high
// 					var topArr = new Array(num);
// 					var nameArr = new Array(num);
// 					var idArr = new Array(num);
// 					var profilePicArr = new Array(num);
//
// 					var picCounter = 0;
// 					for(var i = 0; i < arr.length; i = i + 4){
// 						var classID = arr[i];
// 						var name = arr[i + 1];
// 						var likes = arr[i+2];
// 						var profilePicString = null;
//
// 						updateArray(topArr, idArr, likes, classID, nameArr, name, profilePicArr, profilePicString);
// 					}
// 						console.log("returning Trending classes");
//
// 						console.log(topArr);
// 						console.log(nameArr);
// 						console.log(idArr);
// 						console.log(profilePicArr);
//
// 						callback(topArr, nameArr, idArr, profilePicArr);
// 						DB.close();
// 					});
//
// 				});
//
// 		});


function initCollections(db){
	 db.createCollection("Profiles", function(err, res){
	 	if (err) throw err;
	 	console.log("Profiles Collection created!");
	 });
	db.createCollection("Classes", function(err, res){
		if (err) throw err;
		console.log("Classes Collection created!");
	});
	db.createCollection("Trending Classes", function(err, res){
		if (err) throw err;
		console.log("Trending Classes Collection created!");
	});
	db.createCollection("Profile Page Information", function(err, res){
		if (err) throw err;
		console.log("Profile Page Information!");
	});
}


/**
classUtil.likeClass("paullubb@iastate.edu","5a0b7e0f47da931e4c788017", new Date());
classUtil.likeClass("jeff123","5a0b7e0f47da931e4c788017", new Date());
		util.addProfile("jeff123", "123", "j@j", "jef", "yok", "student");//username, password, email, firstName, lastName, account, callback
	var temp = new Date();
	classUtil.likeClass("jeff","5a0b3d5a5bc4f4432496505f", temp);
	temp = new Date();
	classUtil.likeClass("khan","5a0b3d5a5bc4f4432496505f", temp);
classUtil.addNewGradeObj("5a01d9e3a91726026cb2e52b", "hw2", 30, "4/4/15");//classID,gradeName,gradeMaxValue,dueDate
classUtil.addStudentsToClass("59e26a03322be644cc9af669", "5a01d9e3a91726026cb2e52b");
classUtil.addStudentsToClass("5a00cfd4ae1c8a0114d61095","5a01d9e3a91726026cb2e52b");
classUtil.addStudentsToClass("59ff75021365601935b674d0","5a01d9e3a91726026cb2e52b");
classUtil.addStudentsToClass("59ff6282fe19e01fdcc2f505","5a01d9e3a91726026cb2e52b");
 classUtil.createNewVirtualClassroom("Sovann's Shitty Coding Class", "Sovann");
classUtil.createNewVirtualClassroom("Jeff's Shitty Coding Class", "Paul");
classUtil.beginDiscussion("Jeff's Shitty Coding Class","Paul","Will This Work?"); //className, teacherUsername, discussionName
 classUtil.makeComment("Jeff's Shitty Coding Class","Paul","Another question?", "Jack", "History is da bomb");
 classUtil.makeComment("Jeff's Shitty Coding Class","Paul","Another question?", "Allen", "I like cars more than my friends");
 classUtil.makeComment("Jeff's Shitty Coding Class","Paul","Another question?", "John", "Do you smash bro?");
classUtil.beginDiscussion("Jeff's Shitty Coding Class","Paul","Another question?");
classUtil.getDiscussion("Jeff's Shitty Coding Class","Paul","Another question?", function(found){
	console.log(found);
});
classUtil.createNewVirtualClassroom("ShittyClass 101", "ShitADick@hothothotmail.com");
classUtil.addStudentsToClass();
classUtil.addNewGradeObj("59ff4a7bb3b6da35382a05dc", "hw3", 10, "11/11/11");
util.addProfile("BILLYBOB", "pass", "BB@BB.com", "name", "lastName", "student");
util.addProfile("user1", "pass", "user1@hotmail.com", "name", "lastName", "student");
util.addProfile("user2", "pass", "user2@hotmail.com", "name", "lastName", "student");
util.addProfile("user3", "pass", "user3@hotmail.com", "name", "lastName", "student");
var studentArr = ["59e286e5d39aa027b4fd2639", "59e286e5d39aa027b4fd263a", "59e286e5d39aa027b4fd263b"];
var singleID = "123123123123123";
classUtil.addNewGradeObj("59f26979b1a7d82e30c149c2","hw2", 10, "10/10/10");
classUtil.getStudentGradeObj("59f260f1d53e7a0ab8382219","jeff","hw1",function(obj){
		console.log(obj);
});
classUtil.deleteStudentGradeObj("59f260f1d53e7a0ab8382219", "hw1", "jeff");
classUtil.changeStudentGradeObj("59f260f1d53e7a0ab8382219", "hw1","jeff", 69);
classUtil.createNewVirtualClassroom("Coms309", "jyokup@hotmail.com");
classUtil.updateFollowers("remove", "59f8b04a64b7c62450dbde33", "null", "1234");
//classUtil.updateFollowers("add", "59f8b04a64b7c62450dbde33", "null", "abcd");
classUtil.updateFollowers("get", "59f8b04a64b7c62450dbde33", function(stuff){
	console.log(stuff)
}, "idc");
classUtil.addStudentGradeObj("59f260f1d53e7a0ab8382219", "hw1", "jeff", 1, "1/1/9" );
classUtil.addStudentGradeObj("59f260f1d53e7a0ab8382219", "hw1", "jack", 2, "1/1/9" );
classUtil.addStudentGradeObj("59f260f1d53e7a0ab8382219", "hw1", "allen", 3, "1/1/9" );
classUtil.deleteGradeObj("59f260f1d53e7a0ab8382219", "hw2");

TESTS FOR CODE
profilePageUtil.getProfilePageInformation("mistergame2", function(object){
	console.log("This the object");
	console.log(object.username);
});

util.storeProfileImage("C:\\Users\\jeffy\\Desktop\\309 Project\\SD_C_2_ProjectName\\Jeffrey_Yokup DB\\dog.jpg","justin305");
util.getProfileImage("justin305");
profilePageUtil.updateProfilePageInfo("mistergame2", "dob", "11/12/1996");
profilePageUtil.updateProfilePageInfo("mistergame2", "email", "newEmail");
profilePageUtil.updateProfilePageInfo("mistergame2", "school", "ISU");
var user = util.Profile("mistergame2", "password", "jeff@gmail.com", "jeff", "yokup", "student");
console.log(doesUserExist(user)); //ATTENTION fix this !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
util.changeEmail("jeff@gmail.com","gmail@hotmail");
util.storeProfileImage("C:\\Users\\jeffy\\Desktop\\309 Project\\SD_C_2_ProjectName\\Jeffrey_Yokup DB\\dog.jpg","16012112paul@gmail.com");
util.addProfile("mistergame2", "password", "jeff@hotmail.com", "jeff", "yokup", "student", function(status){
	console.log(status);
});
util.changeUsername("jeffyokup", "poopybutthole");
*/
