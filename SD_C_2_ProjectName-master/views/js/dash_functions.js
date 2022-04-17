
function trendingCourses(){
    $.ajax({
        type: 'GET',
        url: '/getTrendingClasses',
        success: function (trending) {
            var i;
            $('#classroom_div').empty();

            for(i = 0; i < trending.length; i+=4){
                // console.log("Trending class: "+trending[i]+"\nLikes: "+trending[i+1]+"\nClass ID: "+trending[i+2]);
                $('#classroom_div').append("<div class='col-sm-4'><div class='card' style='width: 15rem;'><img id='"+trending[i+2]+"' class='d-block w-100 rounded img' src='img/placeholder.png'/>"+
                    "<div class='card-block'><h4 class='card-title'>"+trending[i]+"</h4><p class='card-text'>Likes: "+trending[i+1]+"</p><a href='/classroom/"+trending[i+2]+"' " +
                    "class='button_pretty'>View Classroom</a>"+
                    "</div></div></div><br>");
                if(trending[i+3] !== undefined && trending[i+3] !== null) {
                    document.getElementById(trending[i + 2]).src = "data:image/jpeg;base64," + trending[i + 3];
                }
            }
        }
    })
}

function topCourses(){

    $.ajax({
        type: 'GET',
        url: '/getTopClasses',
        success: function (trending) {
            var i;
            $('#classroom_div').empty();

            for(i = 0; i < trending.length; i+=4){
                // console.log("Trending class: "+trending[i]+"\nLikes: "+trending[i+1]+"\nClass ID: "+trending[i+2]);
                $('#classroom_div').append("<div class='col-sm-4'><div class='card' style='width: 15rem;'><img id='"+trending[i+2]+"' class='d-block w-100 rounded img' src='img/placeholder.png'/>"+
                    "<div class='card-block'><h4 class='card-title'>"+trending[i]+"</h4><p class='card-text'>Likes: "+trending[i+1]+"</p><a href='/classroom/"+trending[i+2]+"' " +
                    "class='button_pretty'>View Classroom</a>"+
                    "</div></div></div><br>");

                if(trending[i+3] !== undefined && trending[i+3] !== null) {
                    document.getElementById(trending[i + 2]).src = "data:image/jpeg;base64," + trending[i + 3];
                }
            }
        }
    })
}

function allCourses(){
    $.ajax({
        type: 'GET',
        url: '/getAllClasses',
        success: function (trending) {
            var i;
            $('#classroom_div').empty();

            for(i = 0; i < trending.length; i+=4){
                // console.log("Trending class: "+trending[i]+"\nLikes: "+trending[i+1]+"\nClass ID: "+trending[i+2]);
                $('#classroom_div').append("<div class='col-sm-4'><div class='card' style='width: 15rem;'><img id='"+trending[i+2]+"' class='d-block w-100 rounded img' src='img/placeholder.png'/>"+
                    "<div class='card-block'><h4 class='card-title'>"+trending[i]+"</h4><p class='card-text'>Likes: "+trending[i+1]+"</p><a href='/classroom/"+trending[i+2]+"' " +
                    "class='button_pretty'>View Classroom</a>"+
                    "</div></div></div><br>");

                if(trending[i+3] !== undefined && trending[i+3] !== null) {
                    document.getElementById(trending[i + 2]).src = "data:image/jpeg;base64," + trending[i + 3];
                }
            }
        }
    })
}

function newCourses(){
    $.ajax({
        type: 'GET',
        url: '/getNewClasses',
        success: function (trending) {
            var i;
            $('#classroom_div').empty();

            for(i = 0; i < trending.length; i+=4){
                // console.log("Trending class: "+trending[i]+"\nLikes: "+trending[i+1]+"\nClass ID: "+trending[i+2]);
                $('#classroom_div').append("<div class='col-sm-4'><div class='card' style='width: 15rem;'><img id='"+trending[i+2]+"' class='d-block w-100 rounded img' src='img/placeholder.png'/>"+
                    "<div class='card-block'><h4 class='card-title'>"+trending[i]+"</h4><p class='card-text'>Likes: "+trending[i+1]+"</p><a href='/classroom/"+trending[i+2]+"' " +
                    "class='button_pretty'>View Classroom</a>"+
                    "</div></div></div><br>");

                if(trending[i+3] !== undefined && trending[i+3] !== null) {
                    document.getElementById(trending[i + 2]).src = "data:image/jpeg;base64," + trending[i + 3];
                }
            }
        }
    })
}

function getCommunity(){

    $.ajax({
        type: 'GET',
        url: '/getAllUsers',

        success: function (users) {
            var i;
            $('#classroom_div').empty();

            console.log(users.length);

            for(i = 0; i < users.length; i+=2){

            console.log("asfjhakaksdasbdha dont come to school");
                $('#classroom_div').append("<div class='col-sm-4'><div class='card' style='width: 15rem;'><img id='"+users[i]+"' class='d-block w-100 rounded img' src='img/placeholder.png'/>"+
                    "<div class='card-block'><h4 class='card-title'>"+users[i]+"</h4><a href='/profile/"+users[i]+"' " +
                    "class='button_pretty'>View Profile</a>"+
                    "</div></div></div><br>");

                if(users[i+1] !== undefined && users[i+1] !== null) {
                    document.getElementById(users[i]).src = "data:image/jpeg;base64," + users[i + 1];
                }
            }
        }
    })
}

function searchForClasses() {

    var classToSearch = $('#classToSearch').val();

    $.ajax({
        type: 'GET',
        url: '/searchClasses/'+classToSearch,
        success: function (trending) {
            var i;
            $('#classroom_div').empty();

            if(trending !== "No classes found!") {
                for (i = 0; i < trending.length; i += 4) {
                    // console.log("Trending class: "+trending[i]+"\nLikes: "+trending[i+1]+"\nClass ID: "+trending[i+2]);
                    $('#classroom_div').append("<div class='col-sm-4'><div class='card' style='width: 15rem;'><img id='" + trending[i + 2] + "' class='d-block w-100 rounded img' src='img/placeholder.png'/>" +
                        "<div class='card-block'><h4 class='card-title'>" + trending[i] + "</h4><p class='card-text'>Likes: " + trending[i + 1] + "</p><a href='/classroom/" + trending[i + 2] + "' " +
                        "class='button_pretty'>View Classroom</a>" +
                        "</div></div></div><br>");

                    if (trending[i + 3] !== undefined && trending[i + 3] !== null) {
                        document.getElementById(trending[i + 2]).src = "data:image/jpeg;base64," + trending[i + 3];
                    }
                }
            }
            else {
                $('#alert').empty();

                $('#alert').append("<div class='alert alert-success alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                    "<strong>"+trending+"</strong></div>");
            }
        }
    })
}

