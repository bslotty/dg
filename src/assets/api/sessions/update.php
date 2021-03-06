<?php session_start();

    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Max-Age: 1000');
    header('Content-Type: application/json,text/plain');

    
    
    //  Load Basic Functions :: For IP Grab
    require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/functions.php');
    require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/sql.php');

    //  Drivers
    $sql        = new SQL;
    $payload    = json_decode(file_get_contents('php://input'), TRUE);
    $return     = array();

    //  Verify Permissions
    $validUser = $sql->Access($payload["league"], $payload["user"]);

    if ($validUser["status"] == "error") {
        $return = array(
            "status"=>"error",  
            "msg"=>"You do not have sufficent permissions to perform this action"
        );
    } else {


        //  Update
        $query = "UPDATE `Sessions` SET 
            `CourseID`=:course, 
            `StartTimestamp`=:start, 
            `Description`=:description 
        WHERE `ID`=:id ;";

        //  Store ID For Return
        $sessionID = $payload['session']['id'];
        
        //  Set Values
        $values = array(
            ":id"           => $sessionID,
            ":course"       => $payload['session']['course']['id'],
            ":start"        => strtotime($payload['session']['start']),
            ":description"  => $payload['session']['description']
        ); 

        
        $data = $sql->Query($query, $values);
        if ($data === false) {
            $return = array(
                "status"  =>  "error", 
                "msg"     =>  "Unable to update League" 
            );
        } else {
            $return = array(
                "status"  =>  "success", 
                "msg"=> "Session Updated"
            );
        }
    }

    printf(json_encode($return));
?>