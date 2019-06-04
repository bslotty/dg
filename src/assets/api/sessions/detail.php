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
        `s`.`Description`,
        `p`.`Par`
    FROM `Sessions` AS `s`
    JOIN `Leagues` AS `l` ON `s`.`LeagueID`=`l`.`ID` 
    JOIN `Courses` AS `c` ON `s`.`CourseID`=`c`.`ID`
    JOIN `Pars` AS `p` ON `s`.`ID`=`p`.`SessionID`
    WHERE `s`.`ID`=:session ;";

    //  Set Values
    $values = array(":session"=>strtolower($payload["session"]["id"]));

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array(
            "status"    =>  "error",  
            "msg"       =>  "No sessions found",
            "data"      =>  array()
        );
    } else {

        //  Set
        $payload = array(
            "session"   => array(
                "id"        =>  $data[0]['SessionID'],
                "format"    =>  $data[0]['Format'],
                "start"     =>  $data[0]['StartTimestamp'],
                "done"      =>  $data[0]['IsDone'],
                "desc"      =>  $data[0]['Description'],
                "par"       =>  $data[0]['Par']
            ),
            "course"    =>  array(
                "id"        =>  $data[0]['CourseID'],
                "name"      =>  $data[0]['CourseName']
            )
        );

        //  Pass
        $return = array(
            "status"=>"success",  
            "data"=> $payload
        );

    }

    printf(json_encode($return));
?>