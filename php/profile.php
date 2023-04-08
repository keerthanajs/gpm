<?php

    function getUsername(){

    }

    function updateProfile(){
        
    }

    function getUserProfile($username){

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