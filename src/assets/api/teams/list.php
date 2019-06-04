<?php session_start();

    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Max-Age: 1000');
    header('Content-Type: application/json,text/plain');

    
    
    //  Load Basic Functions :: For IP Grab
    require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/functions.php');
    require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/sql.php');


    $payload = json_decode(file_get_contents('php://input'), TRUE);

    $return = array();

    //  Get List of Leagues for User
    $query = "SELECT 
        `t`.`ID` AS `T.ID`,
        `t`.`Name` AS `T.Name`,
        `t`.`Color` AS `T.Color`
    FROM `Teams` AS `t`
    WHERE `t`.`SessionID`=:session ;";

    //  Set Values
    $values = array(":session"=>$payload["session"]["id"]);

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array(
            "status"    =>  "success",  
            "msg"       =>  "No teams found",
            "data"      =>  array()
        );
    } else {

        $payload = [];
        foreach ($data as $o) {
            $payload[] = array(
                "id"        =>  $o['T.ID'],
                "name"      =>  $o['T.Name'],
                "color"     =>  $o['T.Color']
            );
        }

        $return = array(
            "status"=>"success",  
            "data"=> $payload
        );

    }

    printf(json_encode($return));
?>