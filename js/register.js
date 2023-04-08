$(document).ready(function(){
    
        
     
    $("#registerButton").click(function(event){
        event.preventDefault()
        console.log("submitted");
        var username = $("#username").val();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();

        $.ajax({
            url: "php/register.php?username=" + username,
            type: "GET",
            datatype: "json",
            success: function(data){
                console.log(data);
                response = JSON.parse(data);
                console.log(response);
                if(!response.exists){
                    if(password == confirmPassword){
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
                        $("#message").addClass("alert-danger");
                        $("#message").html("Password and Confirm Password doesn't match");
                    }
                }else{
                    $("#message").addClass("alert-danger");
                    $("#message").html("User already exists");
                }
            }
        })             
    })
})

