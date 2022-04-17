define({ "api": [
  {
    "type": "get",
    "url": "/logout",
    "title": "End Session",
    "group": "Account",
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Account",
    "name": "GetLogout"
  },
  {
    "type": "get",
    "url": "/profile/:username",
    "title": "Display username's profile",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username being viewed</p>"
          },
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>Optional parameter - current session object</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HTML",
            "optional": false,
            "field": "User",
            "description": "<p>profile page will be displayed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Account",
    "name": "GetProfileUsername"
  },
  {
    "type": "get",
    "url": "/request_current_session",
    "title": "Retun the session username",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Returns",
            "description": "<p>username</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Account",
    "name": "GetRequest_current_session"
  },
  {
    "type": "get",
    "url": "/signup",
    "title": "Create an Account",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>First Name of Individual Signing Up</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Last Name of Individual Signing Up</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email of Individual Signing Up</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Account",
    "name": "GetSignup"
  },
  {
    "type": "get",
    "url": "/verify/:id",
    "title": "Account Handle Verification Email",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the account. The account id is emailed to users and is based upon the unique Mongo id provided</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Account",
    "name": "GetVerifyId"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login to User Account",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "Renders",
            "description": "<p>dashboard (see Dashboard)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Error",
            "optional": false,
            "field": "Failed_To_Log_In_Error",
            "description": "<p>Password or username was incorrect</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Error",
            "optional": false,
            "field": "Failed_To_Connect_To_MongoDB",
            "description": "<p>Databse is down. QQ</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Account",
    "name": "PostLogin"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login to User Account",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "Renders",
            "description": "<p>dashboard (see Dashboard)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Error",
            "optional": false,
            "field": "Failed_To_Log_In_Error",
            "description": "<p>Password or username was incorrect</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Error",
            "optional": false,
            "field": "Failed_To_Connect_To_MongoDB",
            "description": "<p>Databse is down. QQ</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Account",
    "name": "PostLogin"
  },
  {
    "type": "post",
    "url": "/signup",
    "title": "Sign Up to Opensourcestem",
    "group": "Account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>New User's first name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>New User's last name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>New User's username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>New User's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>New User's password</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "student",
            "description": "<p>Marks whether new user is a student</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "educator",
            "description": "<p>Marks whether new user is an educator</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "Account",
            "description": "<p>Creates a new profile and stores it in the databse. Confirmation email is sent to the sign-up email</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "null",
            "optional": false,
            "field": "Account_Already_Exists",
            "description": "<p>already exists. Message will pop up to notify user to that effect</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Account",
    "name": "PostSignup"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./public/apidocs/main.js",
    "group": "C__Users_Paul_Lubberstedt_Desktop_SD_C_2_ProjectName_routes_public_apidocs_main_js",
    "groupTitle": "C__Users_Paul_Lubberstedt_Desktop_SD_C_2_ProjectName_routes_public_apidocs_main_js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/list_virtual_classrooms",
    "title": "List the Classrooms",
    "group": "Classroom",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "Lists",
            "description": "<p>current classrroms either created (as an educator) or joined (student)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Classroom",
    "name": "GetList_virtual_classrooms"
  },
  {
    "type": "get",
    "url": "/profile/:username/list_virtual_classrooms",
    "title": "List the Classrooms of Username's Profile",
    "group": "Classroom",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "username",
            "description": "<p>Username of Profile being viewed</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "Links",
            "description": "<p>to page displaying current classrroms either created (as an educator) or joined (student) by username</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Classroom",
    "name": "GetProfileUsernameList_virtual_classrooms"
  },
  {
    "type": "get",
    "url": "/dashboard",
    "title": "Link to Dashboard",
    "group": "Dashboard",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "Current",
            "description": "<p>session object</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Dashboard",
    "name": "GetDashboard"
  },
  {
    "type": "get",
    "url": "/storeClassFile",
    "title": "Store Uploaded file",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "base64String",
            "description": "<p>Base64String of the file to be Uploaded</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fileType",
            "description": "<p>File Extension of the submitted files</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fileName",
            "description": "<p>Name of the file isSubmitted</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classID",
            "description": "<p>Id of the class to which the file is being submitted</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "File",
    "name": "GetStoreclassfile"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Display Index Page",
    "group": "Main",
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Main",
    "name": "Get"
  },
  {
    "type": "get",
    "url": "/email",
    "title": "Display Verification Email",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bio",
            "description": "<p>Biography/background story of the user. For the sake of those who have to read your bios - please make them interesting. Exagerration in moderation is a good thing...</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "school",
            "description": "<p>School currently attended</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classes_created",
            "description": "<p>List of classes created by the user</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "educator",
            "description": "<p>is user an educator? True is for yes, false is for no. Mutually exlusive with student</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "student",
            "description": "<p>is the user a student? True if yes, false otherwise. Mutually exclusive with educator</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "GetEmail"
  },
  {
    "type": "get",
    "url": "/fill_profile",
    "title": "Edit Profile",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bio",
            "description": "<p>Biography/background story of the user. For the sake of those who have to read your bios - please make them interesting. Exagerration in moderation is a good thing...</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "school",
            "description": "<p>School currently attended</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "list",
            "description": "<p>of current classes created</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "GetFill_profile"
  },
  {
    "type": "get",
    "url": "/profile",
    "title": "Create Profile",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bio",
            "description": "<p>Biography/background story of the user. For the sake of those who have to read your bios - please make them interesting. Exagerration in moderation is a good thing...</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "school",
            "description": "<p>School currently attended</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "dob",
            "description": "<p>Date of Birth</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classes_created",
            "description": "<p>List of classes created by the user</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "educator",
            "description": "<p>is user an educator? True is for yes, false is for no. Mutually exlusive with student</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "student",
            "description": "<p>is the user a student? True if yes, false otherwise. Mutually exclusive with educator</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "HTML",
            "optional": false,
            "field": "profile",
            "description": "<p>renders respective profile based on usertype - i.e renders student dashboard for students and in a similar fashion renders the teacher dashboard for educators</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "HTML",
            "optional": false,
            "field": "Index",
            "description": "<p>Renders the index page since the user wasn't logged in</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "GetProfile"
  },
  {
    "type": "get",
    "url": "/update_profile_pic",
    "title": "User updates the profile picture",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Profile",
            "description": "<p>picture in 64 bit string format</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "GetUpdate_profile_pic"
  },
  {
    "type": "post",
    "url": "/change_dob",
    "title": "Change Date of Birth",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dob",
            "description": "<p>New Date of Birth that user wants</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "Lists",
            "description": "<p>current classrroms either created (as an educator) or joined (student)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "PostChange_dob"
  },
  {
    "type": "post",
    "url": "/change_email",
    "title": "Change Email",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "new_email",
            "description": "<p>New email that user wants</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "PostChange_email"
  },
  {
    "type": "post",
    "url": "/change_password",
    "title": "Change Username",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "new_username",
            "description": "<p>New username that user wants</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "PostChange_password"
  },
  {
    "type": "post",
    "url": "/change_password",
    "title": "Change Password",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "curr_password",
            "description": "<p>Current Password of Users</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "new_password",
            "description": "<p>New Password that user wants</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "PostChange_password"
  },
  {
    "type": "post",
    "url": "/change_school",
    "title": "Change School",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "school",
            "description": "<p>New shool that user wants</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "PostChange_school"
  },
  {
    "type": "post",
    "url": "/update_bio",
    "title": "Update Biography",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "new_bio",
            "description": "<p>New biography that user wants</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "PostUpdate_bio"
  },
  {
    "type": "post",
    "url": "/upload_profile_pic",
    "title": "Upload Profile Picture",
    "group": "Profile_Functions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>current session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "base64String",
            "description": "<p>Base64 String of the Image that's to be uploaded for future use of profile picture</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Profile_Functions",
    "name": "PostUpload_profile_pic"
  },
  {
    "type": "get",
    "url": "/follower/:operation",
    "title": "Add, remove Follower to Class",
    "group": "Trending",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>Current user Session. Requires being an educator</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "operation",
            "description": "<p>&quot;add&quot;: adds follower to class; &quot;remove&quot;: removes student as follower</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Trending",
    "name": "GetFollowerOperation"
  },
  {
    "type": "get",
    "url": "/getTopClasses",
    "title": "Get Top Rated classes",
    "group": "Trending",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "Number",
            "description": "<p>of classes to Display</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Trending",
    "name": "GetGettopclasses"
  },
  {
    "type": "post",
    "url": "/isClassLiked",
    "title": "Class Liked",
    "group": "Trending",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>Current user Session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classID",
            "description": "<p>Id of Class being unliked</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if a class has likes, false if the class is left to the fates :(</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Trending",
    "name": "PostIsclassliked"
  },
  {
    "type": "post",
    "url": "/likeClass",
    "title": "like a Class",
    "group": "Trending",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>Current user Session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classID",
            "description": "<p>Id of Class being liked</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Trending",
    "name": "PostLikeclass"
  },
  {
    "type": "post",
    "url": "/unlikeClass",
    "title": "Unlike a Classes",
    "group": "Trending",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Session",
            "optional": false,
            "field": "session",
            "description": "<p>Current user Session</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "classID",
            "description": "<p>Id of Class being unliked</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Trending",
    "name": "PostUnlikeclass"
  },
  {
    "type": "get",
    "url": "/getTrendingClasses",
    "title": "Get the Trenging Classes",
    "group": "Trenging",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "num",
            "description": "<p>Number of Classes to Display</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "minutes",
            "description": "<p>Timeframe of how far back one wants to go with trending classes</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "topClasses",
            "description": "<p>List of the top classes currently trending within a given Timeframe</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "idOfTopClasses",
            "description": "<p>List of corresponding class ids</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes.js",
    "groupTitle": "Trenging",
    "name": "GetGettrendingclasses"
  }
] });
