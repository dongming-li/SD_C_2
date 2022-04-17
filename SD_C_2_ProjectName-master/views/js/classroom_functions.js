/*Gets the specific user of the session created*/
function sessionUser() {
    $.ajax({
        type: 'GET',
        url: '/request_current_session',
        success: function (user) {

            if(user != null){
                document.getElementById('name').innerHTML = user;
            }
        }
    })
}

function fillClassDescription() {
    $.ajax({
        type: 'GET',
        url: '/classDescription',
        success: function (data) {
            document.getElementById('information').innerHTML =
                "<h5>Instructor: " + data[0] + "</h5>" + "<h4>Description: " + data[1] + "</h4>";
        }
    })
}

function fillAnnouncements() {
    var i;

    $.ajax({
      type: 'GET',
      url: '/fillAnnouncements',
      success: function (data) {
        document.getElementById('information').innerHTML = "";

        $('#information').append("<h1><strong>Announcements</strong></h1><br>");

        for(i = 0; i < data.length; i++){
            $('#information').append("<h4>"+data[i]+"</h4><br>");
        }
      }
    });
}

function fillGradesStudent() {
  var i;

  $.ajax({
    type: 'GET',
    url:'/studentGrades',
    success: function (data) {
        document.getElementById('information').innerHTML = "";
        $('#information').append('<h3>My Grades</h3><br>');
        for(i = 0; i < data.length; i += 3){
          $('#information').append(data[i] + ": " + data[i+1]  + '/' + data[i+2] + '<br>');
        }
        console.log('yep??');
    }
  });
}

//Sovann do this
function fillGradesEducator() {

}

function newClassDescription() {

    var newDescription = $('#newDescription').val();

    $.ajax({
        type: 'POST',
        url: '/updateClassDescription',
        data: {
            description: newDescription
        },
        success: function (msg) {
            $('#newDescription').val("");
            $('#alert').empty();
            $('#alert').append("<div class='alert alert-success alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                "<strong>"+msg+"</strong></div>");
        }
    })
}

function viewStudents() {
    $.ajax({
        type: 'GET',
        url: '/viewStudents',
        success: function (students) {
            $('#information').empty();

            var i;

            $('#information').append("<h3>Current Student</h3><br>");
            for(i = 0; i < students.length; ++i){
                $('#information').append("<button class='button_pretty'>"+students[i]+"</button><br>");
            }

            $('#information').append("<br><br><input id='studentToAdd' placeholder='Student Username' required/>" +
                "<button class='button_pretty' id='addStudentToClass'>Add Student</button><br>");
        }
    })
}


function addStudent() {
    var student = $('#studentToAdd').val();

    var url = "/addStudent/"+student;

    $.ajax({
        type: 'POST',
        url: url,
        success: function (msg) {
            if(msg !== "") {
                $('#alert').empty();
                $('#alert').append("<div class='alert alert-danger alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                    "<strong>" + msg + "</strong></div>");
            }
        }
    })

}

function makeAnnouncement() {
    var announcement = $('#announcementToAdd').val();

    $.ajax({
        type: 'POST',
        url: '/addAnnouncement',
        data: {announcement: announcement},
        success: function (msg) {
            $('#alert').empty();
            $('#alert').append("<div class='alert alert-success alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                "<strong>"+msg+"</strong></div>");
        }
    })
}

function uploadFile() {
  var filebase = document.getElementById('uploadFile').files[0];
  var fileReader = new FileReader();
  var base64;
  var name = filebase.name;

  fileReader.onload = function () {
    base64 = fileReader.result;
    uploadFileHelper(name, base64);
  };

  if(filebase) {
    fileReader.readAsDataURL(filebase);

  }
  else{

  }
}

function uploadFileHelper (name, base64) {
  $.ajax({
    type: 'POST',
    url: '/storeClassFile',
    data: {
      base64String: base64,
      fileName: name
    },
    success: function(msg) {
      if(msg === "File has been uploaded"){
        //clear list of files?
      }
      else{
        message(1,msg);
      }
    }
  });
}

function fillFiles() {
  var i;

  $.ajax({
    type: 'GET',
    url: '/getClassFile',
    success: function (data) {
      document.getElementById('information').innerHTML = "";
      for(i = 0; i < data.length; i+=3) {
        $('#information').append("<h3>" + data[i+1] + "</h3><br>" + "<embed src='" + data[i] + "' width='500px' height='700px' />");
        // <embed src="img/homework2.pdf" width="800px" height="2100px"/>
      }
    }
  });
}


function fillSubmissions() {

}

function fillDiscussions() {

}

function likeClass() {
    $.ajax({
        type: 'POST',
        url: '/likeClass'
    }).done(isClassLiked());
}

function unlikeClass() {
    $.ajax({
        type: 'POST',
        url: '/unlikeClass'
    }).done(isClassLiked());
}

function isClassLiked() {
    $.ajax({
        type: 'GET',
        url: '/isClassLiked',
        success: function (status) {

            $('#thumbs').empty();

            if(status){
                $('#thumbs').append("<button type='button' class='button_norm' id='dislike' style='color: #ff6666'><i style='color: #ff6666' class='fa fa-thumbs-up fa-3x' aria-hidden='true'></i></button>");
            }
            else{
                $('#thumbs').append("<button type='button' class='button_norm' id='like' style='color: black'><i style='color: black' class='fa fa-thumbs-up fa-3x' aria-hidden='true'></i></button>");
            }
        }
    })
}


/*

function fillClassroom(){

    $.ajax({
        type: 'GET',
        url: '/fillClassroom',
        datatype: 'text',
        success: function (data) {
            if (data) {

                document.getElementById("_announcements");

                document.getElementById("_grades");

                document.getElementById("_files");

                document.getElementById("_submissions");

                document.getElementById("_discussions");


                //document.getElementById("add_students");

                //document.getElementById("post_upcoming");

                document.getElementById("post_announcements");

                document.getElementById("post_grades");

                document.getElementById("post_files");

                document.getElementById("view_submissions");

                document.getElementById('bio').innerHTML = "";
                document.getElementById('dob').innerHTML = "";
                document.getElementById('school').innerHTML = "";

            }
        }
    });
}
 */
