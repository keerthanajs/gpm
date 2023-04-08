$(document).ready(function(){
    $("#register").submit(function(event){
        event.preventDefault()

        var name = document.getElementById("name").value
        var username = document.getElementById("username").value
        var password = document.getElementById("password").value
        var cpwd = document.getElementById("cpassword").value
        var email = document.getElementById("email").value
        var phoneno = document.getElementById("phoneno").value
        var dob = document.getElementById("dob").value

        

        $.post("php/register.php", {name : name, username : username, password : password, email : email, phoneno : phoneno, dob : dob})
        
    })
})