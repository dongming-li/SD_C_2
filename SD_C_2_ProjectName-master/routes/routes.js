var express = require('express');
var router = express.Router();
var util = require('../databaseClasses/ProfileUtil.js');
var ppu = require('../databaseClasses/ProfilePageUtil.js');
var nodemailer = require('nodemailer');
var classUtil = require('../databaseClasses/ClassUtil.js');
var sess;
var path = require('path');
var fs = require('fs');
var trendingClassUtil = require('../databaseClasses/trendingClassesUtil.js');
//var qrImage = require('qr-image');

var views = function (html) {
    return path.join(__dirname + "/views/", html);
};

/*Adding enums for user type*/
var usertypes = {
    INIT: 0, //In case it doesn't get assigned or funky stuff happens. Not that any of our code ever would. But in case someone in the future messes it up for us...
    STUDENT: 1,
    EDUCATOR: 2,
    ADMIN: 3
};

var testClass = "G"; //TODO remove. This is just a temporary variable (for the forseable future) to quickly change the class name that we are testing for all methods. That is until we can connect this with the front end.
var testClassID = "5a1de3e8133b03270c0dec4a"; //TODO remove this as well from final project

var transporter = nodemailer.createTransport({
    service: "gmail", //service?
    auth: {
        type: 'OAuth2',
        user: 'opensourcestem@gmail.com',
        clientId: '54206029386-omonrqtobn90evljnh61arsks26plmfs.apps.googleusercontent.com',
        clientSecret: 'xJf22PLZ2Vxihge9G0Bup1Fu',
        refreshToken: '1/Bokt09toyZXU1i5OwKvf83l7hLuWmaPJKBGin-oOi1c',
        accessToken: 'ya29.GlveBC0J6IHQAIpRjJR4PMfSZvwpUQJBFEPhV94v_Is_GbHxnsTTDbJLlekjRdr--8ZpLjkoa5QMigkZc4-H2APZBIOj4ggKuggjSCrA-AUuHYaxVe66dXo-opGN',
    }
});
var rand, host, link;

/**
*@api {get} / Display Index Page
*@apiGroup Main
*/
router.get('/', function (req, res) {
    res.render('index');
});

//TODO what type is radio buttons? Other Possible types of users...
/**
*@api {get} /signup Create an Account
*@apiGroup Account
*@apiParam {String} firstname First Name of Individual Signing Up
*@apiParam {String} lastname Last Name of Individual Signing Up
*@apiParam {String} email email of Individual Signing Up
*@@apiSuccess {Something} accountType Type of user signing up. Options are between teacher and student account types. Note that administrators are not subject for being chosen
*/
router.get('/signup', function (req, res) {
    res.render('signup');
});

/**
*@api {get} /profile/:username Display username's profile
*@apiGroup Account
*@apiParam {String} username Username being viewed
*@apiParam {Session} session Optional parameter - current session object
*@apiSuccess {HTML} User profile page will be displayed
*/
router.get('/profile/:username', function (req, res) {

    var username = req.params.username;
    sess = req.session;

    if (username === sess.username) {
        res.redirect('/profile');
    } else {
        util.doesUserExist("", username, function (status) {

            if (status) {
                var bio;
                var school;
                var dob;
                var classes_created;
                var accountType;

                ppu.getProfilePageInformation(username, function (obj) {
                    bio = obj.bio + "";
                    school = obj.school + "";
                    dob = obj.dob + "";
                    classes_created = obj.classesCreated + "";
                    accountType = obj.accountType;

                    if (accountType === usertypes.EDUCATOR) {

                        res.render('educator_profile', {
                            bio: bio,
                            school: school,
                            dob: dob,
                            classes_created: classes_created,
                            educator: 1,
                            nonEdit: sess.username
                        });
                    } else {
                        ppu.getProfilePageInformation(username, function (obj) {
                            bio = obj.bio + "";
                            school = obj.school + "";
                            dob = obj.dob + "";
                            classes_created = obj.classesCreated + "";

                            res.render('educator_profile', {
                                bio: bio,
                                school: school,
                                dob: dob,
                                student: 1,
                                nonEdit: sess.username
                                // classes_created: classes_created
                            })
                        })
                    }
                })
            }
            else {
                res.render('index', {
                    msg: "There is not a user with that username"
                });
            }
        });
    }
});

/**
*@api {get} /profile Create Profile
*@apiGroup Profile_Functions
*@apiParam {String} bio Biography/background story of the user. For the sake of those who have to read your bios - please make them interesting. Exagerration in moderation is a good thing...
*@apiParam {String} school School currently attended
*@apiParam {Date} dob Date of Birth
*@apiParam {String} classes_created List of classes created by the user
*@apiParam {boolean} educator is user an educator? True is for yes, false is for no. Mutually exlusive with student
*@apiParam {boolean}student is the user a student? True if yes, false otherwise. Mutually exclusive with educator
@apiSuccess {HTML} profile renders respective profile based on usertype - i.e renders student dashboard for students and in a similar fashion renders the teacher dashboard for educators
@apiError {HTML} Index Renders the index page since the user wasn't logged in
*/
router.get('/profile', function (req, res) {

    var bio;
    var school;
    var dob;
    var classes_created;
    var educator, student;

    sess = req.session;

    if (sess.username !== undefined) {
        util.isEducator(sess.username, function (status) {

            if (status) {
                sess.accountType = 2;
                educator = true;
                student = false;
            }
            else {
                sess.accountType = 0;
                student = true;
                educator = false;
            }

            ppu.getProfilePageInformation(sess.username, function (obj) {
                bio = obj.bio + "";
                school = obj.school + "";
                dob = obj.dob + "";
                classes_created = obj.classesCreated + "";

                res.render('educator_profile', {
                    user: sess.username,
                    bio: bio,
                    school: school,
                    dob: dob,
                    educator: educator,
                    student: student
                });
            });
        })
    }
    else {
        res.render('index', {
            msg: "You're not logged in!"
        })
    }
});

/**
*@api {get} /email Display Verification Email
*@apiGroup Profile_Functions
*@apiParam {String} bio Biography/background story of the user. For the sake of those who have to read your bios - please make them interesting. Exagerration in moderation is a good thing...
*@apiParam {String} school School currently attended
*@apiParam {Date} dob Date of Birth
*@apiParam {String} classes_created List of classes created by the user
*@apiParam {boolean} educator is user an educator? True is for yes, false is for no. Mutually exlusive with student
*@apiParam {boolean}student is the user a student? True if yes, false otherwise. Mutually exclusive with educator
*/
router.get('/email', function (req, res) {
    res.sendFile(views('email.html'));
});

/**
*@api {get} /logout End Session
*@apiGroup Account
*/
router.get('/logout', function (req, res) {
    sess = req.session;

    if (sess.username != "" && sess.username != null) {
        req.session.destroy();
        res.render('index');
    }
    else {
        res.render('index');
    }
});

/**
*@api {get} /dashboard Link to Dashboard
*@apiGroup Dashboard
*@apiParam {Session} Current session object
*/
router.get('/dashboard', function (req, res) {
    sess = req.session;
    if (sess.username) {

        res.render('dashboard');
    } else {

        res.render('index', {
            msg: "You need to login if you want to proceed!"
        });
    }
});

/**
*@api {get} /fill_profile Edit Profile
*@apiGroup Profile_Functions
*@apiParam {String} bio Biography/background story of the user. For the sake of those who have to read your bios - please make them interesting. Exagerration in moderation is a good thing...
*@apiParam {String} school School currently attended
*@apiParam {Date} dob Date of Birth
*@apiParam {String} school shool that's currently being attended
*@apiParam {String[]} list of current classes created
*/
router.get('/fill_profile', function (req, res) {
    var prof = [];

    ppu.getProfilePageInformation(sess.username, function (obj) {

        prof[0] = obj.bio;
        prof[1] = obj.dob;
        prof[2] = obj.school;
        prof[3] = obj.classesCreated;

        res.send(prof);
    });
});

/**
*@api {get} /verify/:id Account Handle Verification Email
*@apiGroup Account
*@apiParam {String} id the id of the account. The account id is emailed to users and is based upon the unique Mongo id provided
*/
router.get('/verify/:id', function (req, res) {
    console.log(req.params.id);

    var id = req.params.id;

    util.doesIDExist(id, function (status) {
        if (status) {
            console.log('[Server-Activation] account ' + id + ' is hereby officially accepted by opensourcestem');
            util.activateAccount(id, function (success) {
                if (success) {
                    console.log('[Server-Activation] account ' + id + ' is hereby officially accepted by opensourcestem');
                    res.sendFile('email.html', {root: "./views"});
                } else {
                    res.send('[Server - Activation] Your account was not successfully activated. Please ask your friendly opensourcestem [undepaid] interns for more information.');
                }
            });
        } else {
            console.log("[Server-Activation] Your account was not successfully activated. Please ask your friendly opensourcestem [undepaid] interns for more information.");
            res.send('[Server - Activation] Your account was not successfully activated. Please ask your friendly opensourcestem [undepaid] interns for more information.');
        }
    });
});

/**
*@api {get} /request_current_session Retun the session username
*@apiGroup Account
*@apiParam {Session} session current session
*@apiSuccess {String} Returns username
*/
router.get('/request_current_session', function (req, res) {
    if (sess.username !== undefined) {
        res.send(sess.username);
    } else {
        res.send("User not logged in");
    }
});

/**
*@api {get} /update_profile_pic User updates the profile picture
*@apiGroup Profile_Functions
*@apiParam {Session} session current session
*@apiParam {String} Profile picture in 64 bit string format
*/
router.get('/update_profile_pic', function (req, res) {

    sess = req.session;

    if (sess.username !== undefined) {
        util.getProfileImage(sess.username, 1, function (profilePic) {
            res.send(profilePic);
        });
    }
});

/**
*@api {get} /list_virtual_classrooms List the Classrooms
*@apiGroup Classroom
*@apiParam {Session} session current session
*@apiSuccess {null} Lists current classrroms either created (as an educator) or joined (student)
*/
router.get('/list_virtual_classrooms', function (req, res) {

    sess = req.session;

    if (sess.username !== undefined) {


        util.doesUserExist("", sess.username, function (status) {

            if (status) {

                util.isEducator(sess.username, function (isEducator) {

                    if(isEducator) {
                        util.getStudentProfile(sess.username, function (obj) {

                            var i;
                            var class_ids = [];

                            for (i = 0; i < obj.classesCreated.length; ++i) {
                                class_ids[i] = obj.classesCreated[i];
                            }

                            res.send(class_ids);
                        })
                    } else {

                        var i;
                        var class_ids=[];

                        util.getStudentProfile(sess.username, function (obj) {

                            for (i = 0; i < obj.classesJoined.length; ++i) {
                                class_ids[i] = obj.classesJoined[i];
                            }

                            res.send(class_ids);
                        })
                    }
                });
            }
        });
    }
});

/**
*@api {get} /profile/:username/list_virtual_classrooms List the Classrooms of Username's Profile
*@apiGroup Classroom
*@apiParam username Username of Profile being viewed
*@apiSuccess {null} Links to page displaying current classrroms either created (as an educator) or joined (student) by username
*/
router.get('/profile/:username/list_virtual_classrooms', function (req, res) {

    var user = req.params.username;
    sess = req.session;
    console.log(sess.username);

    if (user !== "") {

        util.doesUserExist("", user, function (status) {
            if (status) {
                util.getStudentProfile(user, function (obj) {

                    var i;
                    var class_ids = [];


                    for (i = 0; i < obj.classesCreated.length; ++i) {
                        class_ids[i] = obj.classesCreated[i];
                    }


                    res.send(class_ids);
                })
            }
        })
    }
});

/**
*@api {post} /change_password Change Password
*@apiGroup Profile_Functions
*@apiParam {Session} session current session
*@apiParam {String} curr_password Current Password of Users
*@apiParam {String} new_password New Password that user wants
*/
router.post('/change_password', function (req, res) {

    var curr_password = req.body.currPass;
    var new_password = req.body.pass;

    util.user_verification(curr_password, sess.username, function (status) {
        if (status) {

            util.changePassword(sess.username, new_password);

            res.send("Your password has been changed!");

        } else {
            res.send("Your password is incorrect");
        }
    });
});

/**
*@api {post} /change_password Change Username
*@apiGroup Profile_Functions
*@apiParam {Session} session current session
*@apiParam {String} new_username New username that user wants
*/
router.post('/change_username', function (req, res) {

    var new_username = req.body.new_username;

    util.doesUserExist("", new_username, function (status) {

        console.log(new_username + " status: " + status);
        if (!status) {

            util.changeUsername(sess.username, new_username);
            sess.username = new_username;

            res.send("Your username has been changed!");

        } else {
            res.send("Username is already taken, try another!");
        }
    });
});

/**
*@api {post} /change_email Change Email
*@apiGroup Profile_Functions
*@apiParam {Session} session current session
*@apiParam {String} new_email New email that user wants
*/
router.post('/change_email', function (req, res) {

    var new_email = req.body.new_email;

    util.doesUserExist(new_email, "", function (status) {
        if (!status) {

            util.changeEmail(sess.username, new_email);

            res.send("Your email has been changed!");

        } else {

            res.send("Email is already taken, try another!");
        }
    })
});

/**
*@api {post} /update_bio Update Biography
*@apiGroup Profile_Functions
*@apiParam {Session} session current session
*@apiParam {String} new_bio New biography that user wants
*/
router.post('/update_bio', function (req, res) {

    var new_bio = req.body.newBio;

    ppu.updateProfilePageInfo(sess.username, "bio", new_bio);


});

/**
*@api {post} /change_dob Change Date of Birth
*@apiGroup Profile_Functions
*@apiParam {Session} session current session
*@apiParam {String} dob New Date of Birth that user wants
*@apiSuccess {null} Lists current classrroms either created (as an educator) or joined (student)
*/
router.post('/change_dob', function (req, res) {
    var dob = req.body.newDOB;

    ppu.updateProfilePageInfo(sess.username, "dob", dob);

    res.send("Date of birth has been changed");

});

/**
*@api {post} /change_school Change School
*@apiGroup Profile_Functions
*@apiParam {Session} session current session
*@apiParam {String} school New shool that user wants
*/
router.post('/change_school', function (req, res) {
    var school = req.body.newSchool;

    ppu.updateProfilePageInfo(sess.username, "school", school);

    res.send("School has been changed");

});

/**
*@api {post} /upload_profile_pic Upload Profile Picture
*@apiGroup Profile_Functions
*@apiParam {Session} session current session
*@apiParam {String} base64String Base64 String of the Image that's to be uploaded for future use of profile picture
*/
router.post('/upload_profile_pic', function (req, res) {

    if (sess.username != null) {
        var base64String = req.body.profile_pic;
        util.storeProfileImage(null, sess.username, base64String);
    }
});

/**
*@api {post} /signup Sign Up to Opensourcestem
*@apiGroup Account
*@apiParam {String} firstname New User's first name
*@apiParam {String} lastname New User's last name
*@apiParam {String} username New User's username
*@apiParam {String} email New User's email
*@apiParam {String} password New User's password
*@apiParam {int} student Marks whether new user is a student
*@apiParam {int} educator Marks whether new user is an educator
*@apiSuccess {null} Account Creates a new profile and stores it in the databse. Confirmation email is sent to the sign-up email
*@apiError {null} Account_Already_Exists already exists. Message will pop up to notify user to that effect
*/
router.post('/signup', function (req, res) {

    var firstname = req.body.firstname; //first name
    var lastname = req.body.lastname; //last name
    var username = req.body.username; //username
    var email = req.body.email; //email
    var password = req.body.password; //password
    var student = req.body.student;
    var educator = req.body.educator;
    var account;

    if (student) {
        account = "student";
    } else {
        account = "teacher";
    }

    util.doesUserExist(email, username, function (status) {

        if (!status) {
            util.addProfile(username, password, email, firstname, lastname, account);

            util.getStudentProfile(username, function (prof) {
                rand = prof._id;
                console.log("[Server - Signup] id: " + rand);
                host = req.get('host');
                link = "http://" + req.get('host') + "/verify/" + rand;

                //Formats the email
                var mailOptions = {
                    from: "opensourcestem@gmail.com",
                    to: email,
                    subject: "Please confirm your Email account",
                    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                };

                console.log(mailOptions);

                //Sends the email. Will yell via console if email is invalid.
                transporter.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.end("error");
                    } else {
                        console.log("Message sent: " + response.message);
                        res.end("sent");
                    }
                });
            });

            res.render('index');
        }
        else {

            res.render('signup', {
                msg: "There is already an existing user with that username or email!"

            })
        }
    });
});

/**
*@api {post} /login Login to User Account
*@apiGroup Account
*@apiParam {Session} session current session
*@apiParam {String} username Username of account
*@apiParam {String} password Password of account
*@apiSuccess {null} Renders dashboard (see Dashboard)
*@apiError {Error} Failed_To_Log_In_Error Password or username was incorrect
*@apiError {Error} Failed_To_Connect_To_MongoDB Databse is down. QQ
*/
router.post('/login', function (req, res) {

    sess = req.session;
    var username = req.body.username;
    var password = req.body.password;


    /*TODO We need to specify what account type we are logging in - and reroute it to the matching dashboard as required*/

    console.log("[Server - Login] Username: " + username + "\nPassword: " + password);

    util.goodLogin(username, password, function (status) {

        if (status) {

            sess.username = username;
            sess.accountType = usertypes.INIT;

            util.isEducator(sess.username, function (status) {

                console.log("Status: " + status);
                if (status) {
                    sess.accountType = usertypes.EDUCATOR;
                    console.log(sess.accountType);
                }
                else {
                    sess.accountType = usertypes.STUDENT;
                }
            });


            res.redirect('/profile');

        } else {
            res.render('index', {
                msg: "Login failed"
            })
        }
    });
});

/**
*@api {post} /login Login to User Account
*@apiGroup Account
*@apiParam {Session} session current session
*@apiParam {String} username Username of account
*@apiParam {String} password Password of account
*@apiSuccess {null} Renders dashboard (see Dashboard)
*@apiError {Error} Failed_To_Log_In_Error Password or username was incorrect
*@apiError {Error} Failed_To_Connect_To_MongoDB Databse is down. QQ
*/
router.post('/createClassroom', function (req, res) {
    //sess = req.session;
    var name = req.body.classname;
    console.log(sess.username + " is educator: " + sess.accountType === usertypes.EDUCATOR);

    if (sess.username !== undefined) {
        if (sess.accountType === usertypes.EDUCATOR || sess.accountType === usertypes.ADMIN) {//TODO Add admin to list here...maybe*/

            classUtil.createNewVirtualClassroom(name, sess.username);
            console.log('[Server - CreateClassroom]' + sess.username + ' Created Class: ' + name);
            res.send("Class has been successfully created!");
        } else {
            //Not an educator
            console.log('[Server - createClassroom] Not an educator scrub!');
            /*TODO classroom does not render properly*/
            res.render('dashboard');
        }
    } else {
        console.log('[Server] Not logged in');
        res.render('index', {
            msg: "Not logged in"
        });
    }
});



/**
 *  ___________________________________________________________________
 * |THE FOLLOWING ARE THE CLASSROOM OPERATIONS - ENTER AT YOUR OWN RISK|
 * *___________________________________________________________________*
 *
 */

/**
 * This will direct the user to the specified classroom. Each classroom has a unique ID.
 */
 /**
 *@api {get} /classroom/:classID Display Class based on ID
 *@apiGroup Class
 *@apiParam {String} classID Id of the class to which the file is being submitted
 *@apiParam {Session} sess Current user session
 *@apiSuccess {null} Renders classroom of given classID
 */
router.get('/classroom/:classID', function (req, res) {
    var class_id = req.params.classID;
    var i;

    sess = req.session;

    sess.currentClassroom = class_id;

    classUtil.getVirtualClassroom(class_id, function (obj) {

        if (obj !== undefined) {
            var classname = obj.name;

            if (sess.username !== undefined && sess.username === obj.teacherUsername) {

                res.render('classroom', {
                    educator: true,
                    classroom_name: classname
                });
            }
            else {

                var tempBool = false;

                if (sess.username !== undefined) {
                    for (i = 0; i < obj.studentArray.length; ++i) {

                        if (obj.studentArray[i] === sess.username) {
                            tempBool = true;
                        }
                    }
                }
                if(tempBool){
                    res.render('classroom', {
                        student: true,
                        classroom_name: classname
                    });
                }
                else {
                    res.render('classroom', {
                        visitor: true,
                        classroom_name: classname
                    });
                }
            }
        }
        else {
            res.render('index', {
                msg: "That classroom doesn't exist"
            })
        }
    })
});

/**
 * This will direct the user to the specified classroom. Each classroom has a unique ID.
 */
 /**
 *@api {get} /fillAnnouncements Show Present Announcements
 *@apiGroup Class
 *@apiParam {Session} sess Current user session
 *@apiSuccess {String[]} generates an array of announcements
 */
router.get('/fillAnnouncements', function (req, res) {
    if (sess.currentClassroom === undefined) {

        router.render('index', {
            msg: "This classroom doesn't exist"
        });
    }
    else {

        var announcements = [];
        var i;

        classUtil.getVirtualClassroom(sess.currentClassroom, function (obj) {

            for(i = 0; i < obj.announcements.length; ++i){
                announcements.push(obj.announcements[i]);
            }

          res.send(announcements);
      })
    }
});

router.get('/classDescription', function (req, res) {
    if (sess.currentClassroom === undefined) {

        router.render('index', {
            msg: "This classroom doesn't exist"
        });
    }
    else {
        classUtil.getVirtualClassroom(sess.currentClassroom, function (obj) {
            var classInfo = [];

            classInfo[0] = obj.teacherUsername;
            classInfo[1] = obj.classDescription;

            res.send(classInfo);
        });
    }
});

//name, val, max, date
/**
 * The following function retrieves the grades for the current user.
 * This will only be called by the student in his/her respective classroom.
 */
router.get('/studentGrades', function (req, res) {

    var username = sess.username;
    var classID = sess.currentClassroom;
    var reformatted = [];
    var i;

    classUtil.getAllGradesOneClass(username, classID, function (gradesArray) {
        for (i = 0; i < gradesArray.length; i += 4) {
            reformatted[i] = gradesArray[i];
            reformatted[i + 1] = gradesArray[i + 1];
            reformatted[i + 2] = gradesArray[i + 2];
        }

        res.send(reformatted);
    })

});

/**
 * QR code for classroom
 */
router.get('/qr', function (req, res) {
    var class_id = '59efb07d9ad17e19387f0fc3'; //TODO we'll integrate this later obviously
    var class_link = 'localhost:3000/classroom/' + class_id;

//TODO remove after DEMO
//var image2 = qrImage.image('https://www.facebook.com', {type:'png', size:20}).pipe(fs.createWriteStream('./Views/myQr.png'));
    var temo_image = qrImage.image(class_link, {type: 'png', size: 20}).pipe(fs.createWriteStream('myQr.png'));

    var image = qrImage.imageSync(class_link, {type: 'png', size: 20});

    console.log("Link: ");
    console.log(class_link);
    console.log(image.toString('base64'));

    res.send("Done");
    //Sending a temporary image to the routes folder.
});

/*
 * Given a student id will add the student to the class chosen
 * ------------------Teacher functions------------------
 */

/**
 * Views the students within the current class
 */
router.get('/viewStudents', function (req, res) {
    var studentArray = [];

    classUtil.getVirtualClassroom(sess.currentClassroom, function (obj) {
        studentArray = obj.studentArray;

        res.send(studentArray);
    })
});

/**
 * The educator can post specific announcements to the class
 */
router.post('/addAnnouncement', function (req, res) {
    var announcement = req.body.announcement;
    var classID = sess.currentClassroom;

    classUtil.addAnnouncements(classID, announcement);

    res.send("Announcement announced");
});

/**
 * Allows the ability to update the class description
 */
router.post('/updateClassDescription', function (req, res) {
    var desc = req.body.description;
    var classID = sess.currentClassroom;

    classUtil.addDescription(classID, desc);

    res.send("Description updated");
});

/**
 * This function will add students to the class. Only the educator will have this functionality.
 */
router.post('/addStudent/:student_username', function (req, res) {

    var student_username = req.params.student_username;
    var class_id = sess.currentClassroom;

    util.doesUserExist("", student_username, function (status) {

        if (status) {

            util.getStudentProfile(student_username, function (profile) {

                if (profile.isStudent) {

                    classUtil.addStudentsToClass(student_username, class_id);
                } else {
                    res.send("This user not a student.");
                }
            });
        }
        else {
            res.send("This user does not exist");
        }
    })
});

router.get('/removeStudent/:student_username', function (req, res) {
    /*TODO Retrive the class name that the educator wants to add the student to.
     */
    var educator_class = testClass;
    var student_username = req.params.student_username;
    //sess = req.session;
    var student_id;
    var class_id;

//TODO Check if educator. Not being checked for easy testing :)
    if (sess.accountType === usertypes.EDUCATOR) {
        util.getStudentProfile(student_username, function (profile) {
            //Checking is the profile is a student that we're adding. Can't add teachers and/or admins
            if (profile.isStudent) {
                //Retrieving student id
                student_id = profile._id;
                console.log('[server - removeStudent] Student Id: ' + student_id);

                //Retrieving class id
                classUtil.getClassID(educator_class, sess.username, function (id) {
                    class_id = id;
                    console.log('[Server - removeStudent] Class Id: ' + class_id);

                    //Adding student to class. student_id is an object, so we need to call toString()
                    classUtil.removeStudentFromClass(student_id.toString(), class_id);
                })
            } else {
                console.log('WTF');
                //TODO Throw Error
            }
        });
    } else {
        console.log("Not an educator");
    }
    res.send("GG");
});

router.get('/bigAnnouncement', function (req, res) {
   var announcement = req.body.announcement;
   var username = sess.username;

   trendingClassUtil.bigAnnouncement(username, announcement);
});

/*
 * This will be the delete classroom method...
 */
router.get('/deleteClassroom', function (req, res) {
    var name = testClass; //Sovann or Justin - this is the variable which you want to assign the class name to
    /*TODO We need to pull the new class_name and potentially return an error message if classroom creation fails*/

    if (sess.username) {
        if (sess.accountType === usertypes.EDUCATOR || sess.accountType === usertypes.ADMIN) {//TODO Add admin to list here...maybe*/
            classUtil.getClassID(name, sess.username, function (class_id) {
                console.log("[routes - deleteClass] " + class_id)
                classUtil.deleteClass(class_id);
            });
            res.render('educator_profile', {
                user: sess.username
            });
        } else {
            //Not an educator
            console.log('[Server - createClassroom] Not an educator scrub!');
            /*TODO classroom does not render properly*/
            res.render('dashboard');
        }
    } else {
        console.log('[Server] Not logged in');
        res.render('index', {
            msg: "Not logged in"
        });
    }
});

/*
 * Creates new assignment
 */
router.get('/createAssignment/:class_name', function (req, res) {
    var class_name = req.params.class_name;
    var assignment_name = "HW_11";
    var value = 10; //TODO actually retrieve the total for the assignment
    var due_date = "Filler"; //TODO we need to come up with a format of date

    //Checks is logged in
    if (sess.username) {

        //Checks whether user is an educator or administrator
        if (sess.accountType === usertypes.EDUCATOR || sess.accountType.ADMIN) {//logged in and an educator or ADMIN

            //Getting the class_id
            classUtil.getClassID(class_name, sess.username, function (class_id) {
                console.log('[Server - createASsignment] Creating assignment ' + assignment_name + " for the class " + class_name + " (" + class_id + ")");
                //Creating the classroom
                classUtil.addNewGradeObj(class_id.toString(), assignment_name, value, due_date);
            });
            //TODO Probably link to assignment page or
            res.send('Done');
        } else {//not an educator or ADMIN
            console.log('[Server] Yeah...you are not an educator nor administrator');
            res.sendFile('Nice try bud');
        }
    } else {//not logged in
        console.log("[Server - CreateAssignment] Not logged in scrub"); //heff was here
        res.render('index', {
            msg: "Not logged in"
        });
    }
});

router.get('/updateGrade', function (req, res) {

    var student_username = "billbob"; //TODO actually retrieve a student username from the front end
    var class_id = "59ff56d25b38db3268599e81"; //TODO retrive from front-end
    var assignment_name = "HW_11"; //TODO
    var value = 7;//TODO Btw, 7 is a lucky number. But you might wanna retrieve this from the front end.

    if (sess.accountType === usertypes.EDUCATOR) {

        classUtil.changeStudentGradeObj(class_id, assignment_name, student_username, value);

        console.log('[Server - updateGrade] You will be happy to know that ' + student_username + ' got a ' + value + ' on ' + assignment_name + '!')

    }

});
//------------------End Teacher Functions------------------


/*
 *Does the follower operations add or remove. Specify operation by typing the correct operation type:
 * add - adds a student. TODO will need to parse out students name
 * remove - removes a student as follower. TODO will need to parse student name
 */

 /**
 *@api {get} /follower/:operation Add, remove Follower to Class
 *@apiGroup Trending
 *@apiParam {Session} session Current user Session. Requires being an educator
 *@apiParam {String} operation "add": adds follower to class; "remove": removes student as follower
 */
router.get('/follower/:operation', function (req, res) {
    var operation = req.params.operation;
    var class_name = testClass;//TODO We need to specify a class
    var student = "16012112paul@gmail.com";
    //TODO get student user name
    if (sess.accountType = usertypes.EDUCATOR) {

        //Looking up the class ID
        classUtil.getClassID(class_name, sess.username, function (class_id) {

            console.log('[Server follower] Adding/removing student ' + student + ' to ' + class_name + ' (' + class_id + ')');

            util.getStudentProfile(student, function (profile) {
                if (profile.isStudent === true) {
                    classUtil.updateFollowers(operation, class_id, function () {
                    }, profile._id);
                }
            });

        });

        res.render('educator_profile', {
            user: sess.username
        });
    }
});

/*
 * Creates a discussion, teachers, students, and admins
 */
router.get('/beginDiscussion/:discussionName', function (req, res) {
    var discussionName = req.params.discussionName;
    var className = testClass; //TODO obviously you'd want to change this to the actual class name once implemented

    //If logged in as teacher or administrator
    if (sess.accountType === usertypes.EDUCATOR || sess.accountType === usertypes.ADMIN) {

        classUtil.beginDiscussion(className, sess.username, discussionName);

        //TODO DEMO 4. We should probably have the admin create a discussion FOR the teacher - and then also notify the teacher...

    } else { //Not an educator or admin
        //TODO some sort of error handling if student tries to create discussion
        res.send("Git out imposter!");
    }

});

/*
 *Makes a comment.
 */
router.get('/makeComment', function (req, res) {

    var className = testClass; //TODO Obviously you want to make this the current class on the front end - i.e. parse time

//If logged in
    if (sess.username) {

        //Retrieving class id

    }

});

/**
*@api {post} /isClassLiked Class Liked
*@apiGroup Trending
*@apiParam {Session} session Current user Session
*@apiParam {String} classID Id of Class being unliked
*@apiSuccess {boolean} True if a class has likes, false if the class is left to the fates :(
*/
router.get('/isClassLiked', function (req, res) {
    if(sess.username !== undefined){

        var username = sess.username;
        var classID = sess.currentClassroom;

        classUtil.classAlreadyLiked(username, classID, function (status) {
           res.send(status);
        })
    }
});

/**
*@api {post} /likeClass like a Class
*@apiGroup Trending
*@apiParam {Session} session Current user Session
*@apiParam {String} classID Id of Class being liked
*/
router.post('/likeClass', function (req, res) {
    var date = new Date();
    var dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

    if (sess.username !== undefined) {
        var classID = sess.currentClassroom;
        classUtil.likeClass(sess.username, classID, date);
    }
    else {
        router.render('index', {
            msg: "You need to login if you want to like a class!"
        })
    }

    res.send("Today's Date: " + dateString + "\n");//TODO remove
});


/**
*@api {post} /unlikeClass Unlike a Classes
*@apiGroup Trending
*@apiParam {Session} session Current user Session
*@apiParam {String} classID Id of Class being unliked
*/
router.post('/unlikeClass', function (req, res) {

    if (sess.username !== undefined) {
        var classID = sess.currentClassroom;
        classUtil.unlikeClass(sess.username, classID);
    }

});

/*Not implemented TODO TODO TODO TODO TODO TODO
 router.get('/recentLikes', function(req, res){
 var minutes = 20;//TODO obviously you'd want to update the number of minutes. Also TODO what if I wanted to check the last 24 hours? unit conversion needs to occur somewhere down the logic chain.

 if(sess.username){
 classUtil.getRecentLikes()
 }

 });*/

//Returns the trending classes within a certain time frame
/**
* @api {get} /getTrendingClasses Get the Trenging Classes
* @apiGroup Trenging
* @apiParam {int} num Number of Classes to Display
* @apiParam {int} minutes Timeframe of how far back one wants to go with trending classes
* @apiSuccess {String[]} topClasses List of the top classes currently trending within a given Timeframe
* @apiSuccess {String[]} idOfTopClasses List of corresponding class ids
*/
router.get('/getTrendingClasses', function (req, res) {
    var num = 3;
    var minutes = 10; //Number of minutes since the last liked

    var j = 0;
    var trending = [];

    trendingClassUtil.getTrendingClasses(num, minutes, function (topClasses, nameOfTopClasses, idOfClasses, picStrings) {
        for (var i = 0; i < topClasses.length; i++) {

            trending[j] = nameOfTopClasses[i];
            j++;
            trending[j] = topClasses[i];
            j++;
            trending[j] = idOfClasses[i];
            j++;
            trending[j] = picStrings[i];
            j++;
        }

        res.send(trending);
    });
});

router.get('/getNewClasses', function (req, res) {
    var j = 0;
    var trending = [];

    trendingClassUtil.getRecentClasses(function (topClasses, nameOfTopClasses, idOfClasses, picStrings) {
        for (var i = 0; i < topClasses.length; i++) {

            trending[j] = nameOfTopClasses[i];
            j++;
            trending[j] = topClasses[i];
            j++;
            trending[j] = idOfClasses[i];
            j++;
            trending[j] = picStrings[i];
            j++;
        }

        res.send(trending);
    });
});

router.get('/getAllClasses', function (req, res) {
    var j = 0;
    var trending = [];

    trendingClassUtil.getAllCourses(function (topClasses, nameOfTopClasses, idOfClasses, picStrings) {
        for (var i = 0; i < topClasses.length; i++) {

            trending[j] = nameOfTopClasses[i];
            j++;
            trending[j] = topClasses[i];
            j++;
            trending[j] = idOfClasses[i];
            j++;
            trending[j] = picStrings[i];
            j++;
        }

        res.send(trending);
    });
});

router.get('/getAllUsers', function (req, res) {
   var j = 0;
   var i;
   var users = [];

   trendingClassUtil.getAllUsers(function (nameArray, userPics) {

        for(i = 0; i < nameArray.length; ++i){

            users[j] = nameArray[i];
            j++;
            users[j] = userPics[i];
            j++;
        }

        console.log(users);
        res.send(users);
   });
});

//Gets two lists of the top classes (an array of id's and an array of the class likes)
/**
*@api {get} /getTopClasses Get Top Rated classes
*@apiGroup Trending
*@apiParam {int} Number of classes to Display
*/
router.get('/getTopClasses', function (req, res) {
    var num = 3;
    var j = 0;
    var trending = [];
    trendingClassUtil.getTopClasses(num, function (topClasses, nameOfTopClasses, idOfClasses, picStrings) {

        for (var i = 0; i < topClasses.length; i++) {

            trending[j] = nameOfTopClasses[i];
            j++;
            trending[j] = topClasses[i];
            j++;
            trending[j] = idOfClasses[i];
            j++;
            trending[j] = picStrings[i];
            j++;
        }
        res.send(trending);
    });
});

/**
*@api {get} /storeClassFile Store Uploaded file
*@apiGroup File
*@apiParam {String} base64String Base64String of the file to be Uploaded
*@apiParam {String} fileType File Extension of the submitted files
*@apiParam {String} fileName Name of the file isSubmitted
*@apiParam {String} classID Id of the class to which the file is being submitted
*/
router.post('/storeClassFile', function(req, res){
 var base64String = req.body.base64String;
 var fileType = 'word';
 var fileName = req.body.fileName;
 var classID = sess.currentClassroom;

 console.log("Base64String: " + base64String);
 console.log("Name: " + fileName);

 classUtil.storeClassFile(base64String, fileType, fileName, classID);
});

/**
*@api {get} /storeClassFile Store Uploaded file
*@apiGroup File
*@apiParam {String} classID Id of the class to which the file is being submitted
*@apiSuccess {File[]} fileArr Returns an array of file objects
*/
router.get('/getClassFile', function(req, res){

  classID = sess.currentClassroom;
  classUtil.getClassFile(classID, function(fileArr){
    res.send(fileArr);
    console.log('[Server] sending files ' + fileArr.length);
  });

console.log("DONE");

});

router.get('/searchClasses/:classToSearch', function(req, res){

  var searchQuery = req.params.classToSearch;

  trendingClassUtil.searchClasses(searchQuery, function(topArr, nameArr, idArr, strings){

    var length = topArr.length;
    var searchArr = [];
    var j = 0;

    for(var i = 0; i < length; i++){

      searchArr[j] = nameArr[i];
      j++;
      searchArr[j] = topArr[i];
      j++;
      searchArr[j] = idArr[i];
      j++;
      searchArr[j] = strings[i];
      j++;
    }
    if(length !== 0) {
        res.send(searchArr);
    }
    else {
        res.send("No classes found!");
    }
  });
});

router.get('/classApi', function(req, res){
  var path_ = path.join(__dirname+"/public/apidocs/index.html");
  res.sendFile(path_);
});

module.exports = router;
