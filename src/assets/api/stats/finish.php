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


    /*
    Process:
        Set Session IsDone to True;
    */











    //  Get List of Leagues for User
    $query = "SELECT 
        `st`.`ID` AS `S.ID`,
        `st`.`Scores` AS `S.Scores`,
        `a`.`ID` AS `A.ID`,
        `a`.`First` AS `A.First`,
        `a`.`Last` AS `A.Last`,
        `a`.`Email` AS `A.Email`
    FROM `Stats` AS `st`
    JOIN `Accounts` AS `a` ON `st`.`AccountID`=`a`.`ID`
    JOIN `Sessions` AS `sn` ON `st`.`SessionID`=`sn`.`ID`
    WHERE `sn`.`ID`=:session ;";

    //  Set Values
    $values = array(":session"=>strtolower($payload["session"]["id"]));

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array(
            "status"    =>  "error",  
            "msg"       =>  "No stats found",
            "data"      =>  array()
        );
    } else {

        $payload = [];
        foreach ($data as $o) {
            $payload[] = array(
                "id"        =>  $o['S.ID'],
                "session"    =>  array(
                    "id"        =>  $payload["session"]["id"]
                ),
                "user"      =>  array(
                    "id"        =>  $o['A.ID'],
                    "first"     =>  $o['A.First'],
                    "last"      =>  $o['A.Last'],
                    "email"     =>  $o['A.Email']
                ),
                "scores"     =>  $o['S.Scores']
            );
        }

        $return = array(
            "status"=>"success",  
            "data"=> $payload
        );

    }

    printf(json_encode($return));
?>