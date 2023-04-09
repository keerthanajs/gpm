function checkIfUsernameAlreadyTaken(){
    var username = $("#username").val();
    var usernameRegex = /^[a-zA-Z0-9]+$/;

    if(usernameRegex.test(username) && username != ""){
        $.ajax({
            url: "php/register.php?username=" + username,
            type: "GET",
            datatype: "json",
            success: function(data){
                console.log(data);
                response = JSON.parse(data);
                console.log(response);
                if(response.exists){
                    $("#message").removeClass("alert-success");
                    $("#message").addClass("alert-danger");
                    $("#message").html("User already exists");
                }else{
                    $("#message").removeClass("alert-danger");
                    $("#message").html("");
                }
            }
        })
    }
}

function checkPasswordStrength(){ 
    var password = $("#password").val();
    var passwordRegex=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if(password.match(passwordRegex) && password != "") { 
        //clear existing alert if any
        $("#message").removeClass("alert-warning");
        $("#message").removeClass("alert-danger");
        $("#message").removeClass("alert-success");
        $("#message").html("");
    }else{ 
        $("#message").removeClass("alert-success");
        $("#message").removeClass("alert-danger");
        $("#message").addClass("alert-warning");
        $("#message").html("Warning: Password should contain atleast one number, one uppercase, one lowercase and special character.");
    }
}

function checkIfPasswordsMatch(){ 
    let password = $("#password").val();
    let confirmPassword = $("#confirmPassword").val();
    
    if(password == confirmPassword){
        $("#message").removeClass("alert-danger");
        $("#message").html("");
    }else{
        $("#message").removeClass("alert-success");
        $("#message").addClass("alert-danger");
        $("#message").html("Password and Confirm Password doesn't match");
    }
    return password == confirmPassword;
}

function registerUser(event){
    event.preventDefault()
    console.log("submitted");
    
    var username = $("#username").val();
    var password = $("#password").val();

    if(checkIfPasswordsMatch()){
        registerRequest = {
            "username" : username, "password" : password
        };
        $.ajax({
            url: "php/register.php",
            type: "POST",
            datatype: "json",
            contentType: "application/json",
            data: JSON.stringify(registerRequest),
            success: function(data){
                registerResponse = JSON.parse(data);
                if(registerResponse.registered){
                    console.log("Successfully registered");
                    $("#message").addClass("alert-success");
                    $("#message").html("User successfully registered.");
                    window.location.href = "login.html"
                }else{
                    $("#message").removeClass("alert-danger");
                    $("#message").addClass("alert-danger");
                    $("#message").html(registerResponse.error);
                }
            }
        })
    }else{
        $("#message").removeClass("alert-success");
        $("#message").addClass("alert-danger");
        $("#message").html("Password and Confirm Password doesn't match");
    }     
}


$(document).ready(function(){
    $("#username").blur(checkIfUsernameAlreadyTaken)
    //$("#password").blur(checkPasswordStrength);
    $("#confirmPassword").keyup(checkIfPasswordsMatch);
    $("#registerButton").click(registerUser);
})