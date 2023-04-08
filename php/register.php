<?php

    $method = $_SERVER["REQUEST_METHOD"];

    if($method == "GET"){
        $username = $_GET["username"];
        checkUsername($username);
    }elseif($method == "POST"){
        $body = file_get_contents("php://input");
        $user = json_decode($body);
        registerUser($user);
    }

    function checkUsername($username){
        $conn = getConnection();

        $stmt = $conn->prepare("select username from users where username=?");
        $stmt->bind_param("s",$username);

        $stmt->execute();
        $result = $stmt->get_result();
        $response = new stdClass();
        
        if(mysqli_num_rows($result) == 1){
            $response->exists = true;
        }else{
            $response->exists = false;
        }

        echo json_encode($response);
    }

    function registerUser($user){
        $conn = getDBConnection();

        $stmt = $conn->prepare("insert into users (username, password) values(?, ?)");
        $stmt->bind_param("ss", $user->username, $user->password);
        
        $response = new stdClass();
        try{
            $stmt->execute();
            $response->registered = true;
        }catch(Exception $ex){
            $response->registered = false;
            $response->error = $ex->getMessage();
        }
        echo json_encode($response);
    }

    function getDBConnection(){
        $db_host = getenv("DB_HOST");
        $db_user = getenv("DB_USER");
        $db_pass = getenv("DB_PASS");
        $db_name = getenv("DB_NAME");

        $conn =  new mysqli($db_host, $db_user, $db_pass, $db_name);

        if($conn->connect_error){
            die("Connection failed" . $conn->connect_error);
        }

        return $conn;
    }


?>