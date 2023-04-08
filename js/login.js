$(document).ready(function(){
    var sessionId = localStorage.getItem("sessionId");

    $.ajax({
        url: "php/login.php?sessionId="+sessionId,
        type: "GET",
        datatype: "json",
        success: function(data){
            console.log(data);
            loginResponse = JSON.parse(data);
            console.log(loginResponse);
            if(loginResponse.exists){
                window.location.href = "profile.html"
            }
        }
    })
    
    
    $("#loginButton").click(function(event){
        event.preventDefault()
        
        var username = $("#username").val();
        var password = $("#password").val();

        loginRequest = {
            "username" : username, "password" : password
        };

        $.ajax({
            url: "php/login.php",
            type: "POST",
            datatype: "json",
            contentType: "application/json",
            data: JSON.stringify(loginRequest),
            success: function(data){
                //console.log(JSON.stringify(data))
                loginResponse = JSON.parse(data);
                console.log(loginResponse);
                if(loginResponse.success){
                    localStorage.setItem("sessionId", loginResponse.sessionId);
                    window.location.href = "profile.html"
                }else {
                    $("#message").addClass("alert-danger");
                    $("#message").html("Invalid username or password")
                }
            }
        })
    })
    
})