$(document).ready(function(){

    var sessionId = localStorage.getItem("sessionId");
    $.ajax({
        url: "php/login.php?sessionId="+sessionId,
        type: "GET",
        success: function(data){
            console.log(data);
            activeSession = JSON.parse(data);
            console.log(activeSession);
            if(!activeSession.exists){
                console.log("User not logged in");
                window.location.href = "login.html"
            }
        }
    });

    function calculate_age(dob) { 
        var diff_ms = Date.now() - Date.parse(dob);
        var age_dt = new Date(diff_ms); 
      
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    $("#dob").blur(function(){
        var dob = $("#dob").val();
        var age = calculate_age(dob);
        $("#age").html(age);
    })

    $.ajax({
        url: "php/profile.php?sessionId="+sessionId,
        type: "GET",
        success: function(data){
            console.log(data);
            user = JSON.parse(data);
            if('username' in user){
                //$("#username").html(user.username);
                $("#firstname").val(user.firstname);
                $("#lastname").val(user.lastname);
                $("#dob").val(user.dob);
                $("#email").val(user.email);
                $("#phone").val(user.phone);

                var age = calculate_age(user.dob);
                $('#age').html(age);
            }
        }
    })
    
    $("#logout").click(function(){
        console.log("logout");
        //event.preventDefault()
        sessionId = localStorage.getItem("sessionId");
       
        $.ajax({
            url: "php/login.php?logout=true&sessionId="+sessionId,
            type: "GET",
            success: function(data){
                console.log(data);
                logoutResponse = JSON.parse(data);
                console.log(logoutResponse);
                if(logoutResponse.success){
                    localStorage.removeItem("sessionId");
                    window.location.href = "login.html";
                }
            }
        })
    });

    $("#saveButton").click(function(event){
        event.preventDefault()
        sessionId = localStorage.getItem("sessionId");
        console.log("Save button "+sessionId);
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var dob = $("#dob").val();
        var email = $("#email").val();
        var phone = $("#phone").val();

        profileData = {
            "firstname" : firstname, "lastname" : lastname, "dob" : dob, "email" : email, "phone": phone
        };

        
        $.ajax({
            url: "php/profile.php?sessionId="+sessionId,
            type: "POST",
            data: JSON.stringify(profileData),
            dataType: "json",
            contentType: "application/json",
            success: function(response){
                console.log(JSON.stringify(response));
                if(response.success){
                    $("#message").removeClass("alert-danger");
                    $("#message").addClass("alert-success");
                }else {
                    $("#message").removeClass("alert-success");
                    $("#message").addClass("alert-danger");
                }
                
                $("#message").html(response.message);
            }
        })
    });
})

