function checkIfUserIsLoggedIn(sessionId){
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
}

function calculateAge() { 
    let dob = $("#dob").val();
    
    let diff_ms = Date.now() - Date.parse(dob);
    const millis_in_a_day = 1000 * 60 * 60 * 24;
    const age_in_days = diff_ms / millis_in_a_day; 
    const age = Math.floor(age_in_days / 365);
    
    $("#age").html(age);
}

function populateUserProfile(sessionId){
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

                calculateAge();
            }
        }
    });
}

function logout(sessionId){
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
}

function saveUserProfile(event){
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
}

$(document).ready(function(){

    var sessionId = localStorage.getItem("sessionId");
    checkIfUserIsLoggedIn(sessionId);
    $("#dob").blur(calculateAge);

    populateUserProfile(sessionId);
    
    $("#logout").click(logout);

    $("#saveButton").click(saveUserProfile);
})

