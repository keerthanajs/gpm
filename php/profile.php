<?php
    $method = $_SERVER["REQUEST_METHOD"];

    if($method == "GET"){
        $sessionId = $_GET["sessionId"];
        $username = getUsername($sessionId);
        $profile = getUserProfile($username);
        echo json_encode($profile);
    }elseif($method == "POST"){
        $body = file_get_contents('php://input');
        $user = json_decode($body);
        $sessionId = $_GET["sessionId"];
        $username = getUsername($sessionId);
        $response = new stdClass();

        if(!empty($username)){
            saveProfile($username, $user);
            $response->success = true;
            $response->message = "Profile saved successfully";
        }else {
            $response->success = false;
            $response->message = "Invalid session";
        }
        echo json_encode($response);
    }

    function saveProfile($username, $user){
        $manager = getMongoDBManager();

        $bulkWrite=new MongoDB\Driver\BulkWrite();

        $userProfile = getUserProfile($username);
        
        if(!isset($userProfile->username)){
            $user->username = $username;
            $bulkWrite->insert($user);    
        }else {
            $bulkWrite->update(['username' => $username], ['$set' => $user]);
        }
        
        $manager->executeBulkWrite('guvidb.profiles', $bulkWrite);
    }

    function getUsername($sessionId){
        $redis = getRedisConnection();
        $username = $redis->get($sessionId);
        return $username;
    }

    function getUserProfile($username){
        $manager = getMongoDBManager();
        $query = new MongoDB\Driver\Query(array('username' => $username));
        $cursor = $manager->executeQuery('guvidb.profiles', $query);
        $document = new stdClass();
        foreach($cursor as $doc){
            $document = $doc;
            break;
        }
        return $document;
    }

    function getRedisConnection(){
        $redis_host = getenv("REDIS_HOST");
        $redis_port = getenv("REDIS_PORT");

        $redis = new redis();
        $redis->connect($redis_host, $redis_port);
        return $redis;
    }

    function getMongoDBManager(){
        $mongo_host = getenv("MONGO_HOST");
        $mongo_port = getenv("MONGO_PORT");
        
        $manager = new MongoDB\Driver\Manager("mongodb://$mongo_host:$mongo_port");
        return $manager;
    }
?>