$(document).ready(function(){
    
    $("#loginButton").click(function(event){
        event.preventDefault()
        
        var username = $("#username").val();
        var password = $("#password").val();

        loginRequest = {
            "username" : username, "password" : password
        };

        $.ajax({
            url:  "php/login.php",
            type: "POST",
            datatype: "json",
            contentType: "application/json",
            data: JSON.stringify(loginRequest),
            success: function(data){
                //console.log(JSON.stringify(data))
                loginResponse = JSON.parse(data);
                console.log(loginResponse);
                if(loginResponse.success){
                    window.location.href = "register.html"
                }else {
                    $("#message").html("Invalid username or password")
                }
            }
        })
    })
})