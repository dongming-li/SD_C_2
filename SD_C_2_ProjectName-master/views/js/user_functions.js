var cropper;

function view_switch(view) {

    document.location.href = document.location.origin + view;
}

function authentication() {

    document.getElementsByClassName('alert')[0].innerHTML = '';

    var failure = 0;

    if ((document.getElementById('pass').value === document.getElementById('confirm_pass').value)
        && document.getElementById('pass').value) {

    }
    else if (!document.getElementById('pass').value) {

        failure = 1;
        message(failure, "You must enter a password!");
    }
    else {

        failure = 1;
        message(failure, "The entered passwords do not match.");
    }
    if ((document.getElementById('email').value === document.getElementById('confirm_email').value)
        && document.getElementById('email').value) {

    }
    else if (!document.getElementById('email').value) {

        failure = 1;
        message(failure, "You must enter an email");
    }
    else {
        failure = 1;
        message(failure, "The emails you entered do not match!");
    }

    if (failure) {

        return false;
    }
}

function message(err, msg) {

    if (err) {
        document.getElementsByClassName('alert')[0].innerHTML += "<div class='alert alert-danger alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
            "<strong>" + msg + "</strong></div>";
    }
    else {
        document.getElementsByClassName('alert')[0].innerHTML += "<div class='alert alert-success alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
            "<strong>" + msg + "</strong></div>";
    }
}

function showDiv(e) {
    var div = document.getElementById(e);
    if (window.getComputedStyle(div, null).display === "none") {
        div.style.display = "block";
    }
    else {
        div.style.display = "none";
    }
}

function changeBio() {

    var newBio = $('textarea#_bio').val();

    $.ajax({
        type: 'POST',
        url: '/update_bio',
        dataType: 'text',
        data: {
            newBio: newBio
        }
    });
}

function changeDOB() {
    var newDOB = document.getElementById('newDOB').value;

    $.ajax({
        type: 'POST',
        url: '/change_dob',
        dataType: 'html',
        data: {
            newDOB: newDOB
        },
        success: function (msg) {
            message(0, msg);
        }
    });
}

function changeSchool() {
    var newSchool = document.getElementById('newSchool').value;

    $.ajax({
        type: 'POST',
        url: '/change_school',
        dataType: 'html',
        data: {
            newSchool: newSchool
        },
        success: function (msg) {
            message(0, msg);
        }
    });
}

function fill_profile() {

    $.ajax({
        type: 'GET',
        url: '/fill_profile',
        datatype: 'text',
        success: function (data) {
            if (data) {

                document.getElementById('bio').innerHTML = "";
                document.getElementById('dob').innerHTML = "";
                document.getElementById('school').innerHTML = "";

                $('#bio').append(data[0]);
                $('#dob').append(data[1]);
                $('#school').append(data[2]);
            }
        }
    });
}

function changePassword() {
    var currPass = document.getElementById('currentPassword').value;
    var pass = document.getElementById('newPassword').value;
    var confirmNewPass = document.getElementById('newPasswordConfirm').value;

    if (pass === currPass) {
        message(1, "Your new password must not be the same as your old one!");
        return false;

    } else if (pass === confirmNewPass) {

        $.ajax({
            type: 'POST',
            url: '/change_password',
            dataType: 'html',
            data: {
                curr_password: currPass,
                new_password: pass
            },
            success: function (msg) {
                if (msg === "Your password has been changed!") {
                    message(0, msg);
                    $('#currentPassword').val("");
                    $('#newPassword').val("");
                    $('#newPasswordConfirm').val("");
                } else {
                    message(1, msg);
                }
            }
        });
    }
    else if (!pass) {
        message(1, "You must enter a password!");
        return false;
    }
    else {
        message(1, "The passwords you have entered do not match!");
        return false;
    }
}

function changeUsername() {

    var newUser = document.getElementById('newUsername').value;
    var confirmNewUser = document.getElementById('newUsernameConfirm').value;
    console.log(newUser);

    if (newUser === confirmNewUser && newUser) {
        $.ajax({
            type: 'POST',
            url: '/change_username',
            dataType: 'html',
            data: {
                new_username: newUser
            },
            success: function (msg) {
                if (msg === "Your username has been changed!") {
                    message(0, msg);
                    $('#newUsername').val("");
                    $('#newUsernameConfirm').val("");
                } else {
                    message(1, msg);
                }
            }
        });
    }
    else if (!newUser) {
        message(1, "You must enter a username!");
        return false;
    }
    else {
        message(1, "Please check to make sure the new usernames match!");
        return false;
    }
}

function changeEmail() {
    var newEmail = document.getElementById('newEmail').value;
    var confirmNewEmail = document.getElementById('newEmailConfirm').value;

    if (newEmail === confirmNewEmail && newEmail) {
        $.ajax({
            type: 'POST',
            url: '/change_email',
            dataType: 'html',
            data: {
                new_email: newEmail
            },
            success: function (msg) {
                if (msg === "Your email has been changed!") {
                    message(0, msg);
                    $('#newEmail').val("");
                    $('#newEmailConfirm').val("");
                } else {
                    message(1, msg);
                }
            }
        });
    }
    else if (!newEmail) {
        message(1, "You must enter an Email!");
        return false;
    }
    else {
        message(1, "Please make sure the Email you have entered is correct!");
        return false;
    }
}

function imageListen() {

    document.getElementById('upload').addEventListener('change', getImage, true);
}

function getImage() {
    var file = document.getElementById('upload').files[0];
    var reader = new FileReader();

    reader.onload = function () {
        startCropper();
        cropper.image.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    }
    else {

    }
}

function startCropper() {
    cropper = {
        ctx: document.getElementById("image").getContext('2d'),
        image: new Image(),
        scale: 0.1,
        click: false,
        baseX: 0,
        baseY: 0,
        lastPointX: 0,
        lastPointY: 0,
        cutoutWidth: 25,
        windowWidth: 200,
        init: function () {
            this.image.setAttribute('crossOrigin', 'anonymous');
            this.image.onload = this.onImageLoad.bind(this);
            document.getElementById('cropButton').onclick = this.showCroppedImage.bind(this);
            document.getElementById('slider').oninput = this.updatedScale.bind(this);
        },
        onImageLoad: function () {
            this.drawImage(0, 0);
            this.ctx.canvas.onmousedown = this.onMouseDown.bind(this);
            this.ctx.canvas.onmousemove = this.onMouseMove.bind(this);
            this.ctx.canvas.onmouseup = this.onMouseUp.bind(this);
        },
        drawImage: function (x, y) {
            var w = this.ctx.canvas.width,
                h = this.ctx.canvas.height;
            this.ctx.clearRect(0, 0, w, h);
            this.baseX = this.baseX + (x - this.lastPointX);
            this.baseY = this.baseY + (y - this.lastPointY);
            this.lastPointX = x;
            this.lastPointY = y;
            this.ctx.drawImage(this.image, this.baseX, this.baseY, Math.floor(this.image.width * this.scale), Math.floor(this.image.height * this.scale));
            this.drawCutout();
        },
        drawCutout: function () {
            this.ctx.fillStyle = 'rgba(128, 128, 128, 0.7)';
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.moveTo(this.cutoutWidth, this.cutoutWidth);
            this.ctx.lineTo(this.cutoutWidth, this.windowWidth + this.cutoutWidth);
            this.ctx.lineTo(this.cutoutWidth + this.windowWidth, this.cutoutWidth + this.windowWidth);
            this.ctx.lineTo(this.cutoutWidth + this.windowWidth, this.cutoutWidth);
            this.ctx.closePath();
            this.ctx.fill();
        },
        onMouseDown: function (e) {
            e.preventDefault();
            var location = this.windowToCanvas(e.clientX, e.clientY);
            this.click = true;
            this.lastPointX = location.x;
            this.lastPointY = location.y;
        },
        onMouseMove: function (e) {
            e.preventDefault();
            if (this.click) {
                var location = this.windowToCanvas(e.clientX, e.clientY);
                this.drawImage(location.x, location.y);
            }
        },
        onMouseUp: function (e) {
            e.preventDefault();
            this.click = false;
        },
        windowToCanvas: function (x, y) {
            var canvas = this.ctx.canvas;
            var bound = canvas.getBoundingClientRect();
            return {
                x: x - bound.left * (canvas.width / bound.width),
                y: y - bound.top * (canvas.height / bound.height)
            };
        },
        showCroppedImage: function () {
            var tempCtx, tempCanvas;
            tempCanvas = document.createElement('canvas');
            tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = this.windowWidth;
            tempCanvas.height = this.windowWidth;
            tempCtx.drawImage(this.ctx.canvas, this.cutoutWidth, this.cutoutWidth, this.windowWidth, this.windowWidth, 0, 0, this.windowWidth, this.windowWidth);
            var vData = tempCanvas.toDataURL("image/jpeg");
            document.getElementById('profileImage').src = vData;
        },
        updatedScale: function (e) {
            this.scale = e.target.value;
            this.drawImage(this.lastPointX, this.lastPointY);
        }

    };

    cropper.init();
}

function reset() {
    document.getElementById('slider').value = 0.1;
    cropper.scale = 0.1;
    cropper.ctx.clearRect(0, 0, cropper.ctx.canvas.width, cropper.ctx.canvas.height)
    cropper.ctx.drawImage(cropper.image, 0, 0, Math.floor(cropper.image.width * cropper.scale), Math.floor(cropper.image.height * cropper.scale));
    cropper.drawCutout();
    cropper.baseX = 0;
    cropper.baseY = 0;
}

function create_class() {

    var classname = $('#classname').val();

    $.ajax({
        type: 'POST',
        url: '/createClassroom',
        dataType: 'text',
        data: {
            classname: classname
        },
        success: function (msg) {
            document.getElementById('classname').value = "";
            $('#alert2').append("<div class='alert alert-success alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                "<strong>" + msg + "</strong></div>");
        }
    })
}
