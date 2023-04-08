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
            if(loginResponse.exists == false){
                alert("You are not logged in");
                window.location.href = "login.html"
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
    })
})

