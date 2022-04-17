/*Uploads the chosen profile picture to the database*/
function uploadProfilePic() {
    var newProfilePic = document.getElementById('profileImage').src;
    newProfilePic = newProfilePic.replace("data:image\/jpeg;base64,", '');


    $.ajax({
      type: 'POST',
      url: '/upload_profile_pic',
      dataType: 'text',
      data: {
        profile_pic: newProfilePic
      },
      success: function(msg){
        if(msg === "Your profile picture has been uploaded!"){
          message(0,msg);
          $('#profileImage').src("");
          $('image').src("");

        }
        else{
          message(1,msg);
        }
      }
    });

    getProfilePic();
}

/*places the cropped profile picture into the profile picture area*/
function getProfilePic() {
  $.ajax({
      type: 'GET',
      url: '/update_profile_pic',
      dataType: 'text',
      success: function(data) {
        if(data != null){
            document.getElementById('profilePic').src = "data:image/jpeg;base64," + data;
        }
      }
  });
}

function listClasses(currURL){

    $('#classroom_div').empty();
    
    if (currURL.includes("/profile/")) {
        
        $.ajax({
            type: 'GET',
            url: window.location.href + '/list_virtual_classrooms',
            success: function (classes) {
                if (classes !== undefined) {
                    var i;
                    if (classes[0] !== '<') {

                        for (i = 0; i < classes.length; i++) {
                            var url = "/classroom/" + classes[i];
                            i++;
                            $('#classroom_div').append("<button class='button_pretty' id='" + url + "' onclick='view_switch(this.id)'>" + classes[i] + "</button><br>");
                        }
                    }
                }
            }
        });

    } else {
        $.ajax({
            type: 'GET',
            url: '/list_virtual_classrooms',
            success: function (classes) {
                if (classes !== undefined) {
                    var i;
                    if (classes[0] !== '<') {

                        for (i = 0; i < classes.length; i++) {
                            var url = "/classroom/" + classes[i];
                            i++;
                            $('#classroom_div').append("<button class='button_pretty' id='" + url + "' onclick='view_switch(this.id)'>" + classes[i] + "</button><br>");
                        }
                    }
                }
            }
        });
    }
}

function bigAnnounce() {
    var announcement = $('#announcementToAdd').val();

    $.ajax({
        type: 'POST',
        url: '/bigAnnouncement',
        data: {
            announcement: announcement
        },
        success: function () {
            $('#alert').append("<div class='alert alert-success alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                "<strong>Announcement sent to all classes</strong></div>");
        }
    })
}