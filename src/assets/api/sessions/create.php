<?php session_start();

    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Max-Age: 1000');
    header('Content-Type: application/json,text/plain');

    
    
    //  Load Basic Functions :: For IP Grab
    require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/functions.php');
    require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/sql.php');
    $sql = new SQL;

    $payload = json_decode(file_get_contents('php://input'), TRUE);

    $return = array();

    //  Verify Permissions
    $validUser = $sql->Access($payload["league"], $payload["user"]);

    if ($validUser["status"] == "error") {
        $return = array(
            "status"=>"error",  
            "msg"=>"You do not have sufficent permissions to perform this action"
        );
    } else {

        
        if ($payload['league']["id"] != null) {
            //  Create
            $query = "INSERT INTO `Sessions` (`ID`, `LeagueID`, `CourseID`, `StartTimestamp`, `Description`) VALUES 
            (:id, :league, :course, :start, :description);
            INSERT INTO `Pars` (`ID`, `SessionID`, `Par`) VALUES 
            (:parid, :sessionid, :par)";

            $payload["id"] = date("U") . rand(100000, 999999);
            

            //  Store ID For Return
            $sessionID = $payload["id"];
            $parID = date("U") . rand(100000, 999999);

            //  Set Values
            $values = array(
                ":id"           => $sessionID,
                ":league"       => $payload['league']['id'],
                ":course"       => $payload['session']['course']['id'],
                ":start"        => strtotime($payload['session']['start']),
                ":description"  => $payload['session']['description'],
                ":parid"        => $parID,
                ":sessionid"    => $sessionID,
                ":par"          => "[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]"
            ); 

            $data = $sql->Query($query, $values);
            if ($data === false) {
                $return = array(
                    "status"=>"error", 
                    "msg"=>"Unable to create Session"
                );
            } else {
                $return = array(
                    "status"    => "success", 
                    "msg"       => "Session Created!", 
                    "insertID"  => $sessionID,
                    "pars"      => $parID
                );
            }

        } else {
            $return = array(
                "status"=>"error", 
                "msg"=>"Data not set. League cannot be null."
            );
        }
    }

    printf(json_encode($return));
?>