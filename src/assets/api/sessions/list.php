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
        `s`.`ID` AS `SessionID`,
        `c`.`ID` AS `CourseID`, 
        `c`.`Name` AS `CourseName`,
        `s`.`Format`,
        `s`.`StartTimestamp`,
        `s`.`IsDone`,
        `s`.`Description`
    FROM `Sessions` AS `s`
    JOIN `Leagues` AS `l` ON `s`.`LeagueID`=`l`.`ID` 
    JOIN `Courses` AS `c` ON `s`.`CourseID`=`c`.`ID`
    WHERE `l`.`ID`=:league
    ORDER BY `s`.`StartTimestamp` DESC;";

    //  Set Values
    $values = array(":league"=>strtolower($payload["league"]["id"]));

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array(
            "status"    =>  "error",  
            "msg"       =>  "No sessions found",
            "data"      =>  array()
        );
    } else {

        $payload = [];
        foreach ($data as $o) {
            $payload[] = array(
                "id"        =>  $o['SessionID'],
                "format"    =>  $o['Format'],
                "start"     =>  $o['StartTimestamp'],
                "done"      =>  $o['IsDone'],
                "desc"      =>  $o['Description'],
                "course"    =>  array(
                    "id"        =>  $o['CourseID'],
                    "name"      =>  $o['CourseName'],
                )
            );
        }

        $return = array(
            "status"=>"success",  
            "data"=> array(
                "sessions" => $payload
            )
        );

    }

    printf(json_encode($return));
?>