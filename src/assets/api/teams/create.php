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

        
        if ($payload['session']["id"] != null) {
            //  Create
            $query = "INSERT INTO `Teams` (`ID`, `SessionID`, `Name`, `Color`) 
            VALUES (:id, :session, :name, :color)";

            $payload["id"] = date("U") . rand(100000, 999999);

            //  Store ID For Return
            $teamID = $payload["id"];
            
            //  Set Values
            $values = array(
                ":id"         => $teamID,
                ":session"    => $payload['session']['id'],
                ":name"       => $payload['team']['name'],
                ":color"      => $payload['team']['color']["name"],
            ); 

            $data = $sql->Query($query, $values);
            if ($data === false) {
                $return = array(
                    "status"=>"error", 
                    "msg"=>"Unable to create Team"
                );
            } else {
                $return = array(
                    "status"    => "success", 
                    "msg"       => "Team Created!", 
                    "insertID"  => $teamID
                );
            }

        } else {
            $return = array(
                "status"=>"error", 
                "msg"=>"Data not set. Session cannot be null."
            );
        }
    }

    printf(json_encode($return));
?>