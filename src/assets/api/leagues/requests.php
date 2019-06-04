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
    `p`.`ID` AS `P.ID`, 
    `p`.`Level` AS `P.Level`,
    `p`.`Status` AS `P.Status`,
    `l`.`ID` AS `L.ID`, 
    `l`.`Name` AS `L.Name`,
    `a`.`ID` AS `A.ID`,
    `a`.`First` AS `A.First`,
    `a`.`Last` AS `A.Last`,
    `a`.`Email` AS `A.Email`
    FROM `Permissions` AS `p`
    JOIN `Leagues` AS `l` ON `p`.`LeagueID`=`l`.`ID` 
    JOIN `Accounts` AS `a` ON `p`.`UserID`=`a`.`ID` 
    WHERE `l`.`ID`=:league AND `p`.`Status`='pending'";

    //  Set Values
    $values = array(":league"=>strtolower($payload['league']['id']));

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array("status"=>"success",  "msg"=>"No requests", "data"=> array());
    } else {
        $payload = [];
        foreach ($data as $k => $o) {
            $payload[] = array(
                "id"        =>  $o['P.ID'],
                "level"     =>  $o['P.Level'],
                "status"    =>  $o['P.Status'],
                "league"    =>  array(
                    "id"            =>  $o['L.ID'],
                    "name"          =>  $o['L.Name']
                ),
                "user"      =>  array(
                    "id"            =>  $o['A.ID'],
                    "first"         =>  $o['A.First'],
                    "last"          =>  $o['A.Last'],
                    "email"         =>  $o['A.Email']
                )
            );
        }

        $return = array("status"=>"success",  "data"=>$payload);
    }

    printf(json_encode($return));

    /*      Data Model
    export class Permissions {
        constructor(
            public id: string,
            public league: League,
            public user: User,
            public level: string,
            public status: string,
        ) {}
    }
?>