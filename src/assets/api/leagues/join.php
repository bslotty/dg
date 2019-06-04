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

    //  Prepare
    $query = "SELECT * FROM `Permissions` WHERE `LeagueID`=:league AND `UserID`=:user;";
    
    //  Set
    $values = array(
        ":league" => $payload["league"]["id"],
        ":user" => $payload["user"]["id"]
    );
    
    //  Run
    $data = $sql->Query($query, $values);
    if (count($data) != 0) {
        $return = array("status"=>"error",  "msg"=>"There is another request pending");
    } else {

        //  Get List of Leagues for User
        $query = "INSERT INTO `Permissions` (`ID`, `LeagueID`, `UserID`, `Level`, `Status`) VALUES (:id, :league, :user, 'member', 'pending')";
    
        //  Set Values
        $values = array(
            ":id" => date("U") . rand(100000, 999999),
            ":league" => $payload["league"]["id"],
            ":user" => $payload["user"]["id"]
        );
        
        $data = $sql->Query($query, $values);
        if (!isset($data)) {
            $return = array("status"=>"error",  "msg"=>"Unable to submit request, please try again.");
        } else {
            $return = array("status"=>"success",  "data"=>$data);
        }
    }

    printf(json_encode($return));
?>