<?php
    $method = $_SERVER["REQUEST_METHOD"];

    if($method == "POST"){
        $body = file_get_contents('php://input');
        $loginRequest = json_decode($body);
        login($loginRequest->username, $loginRequest->password);
    }elseif($method == "GET"){
        $sessionId = $_GET["sessionId"];
        if(isset($_GET["logout"])){
            logout($sessionId);
        }else {
            isSessionActive($sessionId);
        }
    }

    function isSessionActive($sessionId){
        $redis = getRedisConnection();
        $response = new stdClass();
        if($redis->get($sessionId) != null){
            $response->exists = true;
        }else {
            $response->exists = false;
        }
        echo json_encode($response);
    }

    function login($username, $password){
        $conn = getDBConnection();
        $redisConn = getRedisConnection();

        $stmt = $conn->prepare("select username, password from users where username=? and password=?");
        $stmt->bind_param("ss", $username, $password);

        $stmt->execute();
        $result = $stmt->get_result();

        $loginResponse = new stdClass();
        if(mysqli_num_rows($result) == 1){
            $sessionId = uniqid();
            $loginResponse->success = true;
            $loginResponse->sessionId = $sessionId;
            $redisConn->set($sessionId, $username);
        }else{
            $loginResponse->success = false;
        }

        echo json_encode($loginResponse);
    }

    function logout($sessionId){
        $redis = getRedisConnection();
        $redis->delete($sessionId);

        $logoutResponse = new stdClass();
        $logoutResponse->success = true;
        
        echo json_encode($logoutResponse);
    }


    function getRedisConnection(){
        $redis_host = getenv("REDIS_HOST");
        $redis_port = getenv("REDIS_PORT");

        $redis = new redis();
        $redis->connect($redis_host, $redis_port);
        return $redis;
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
