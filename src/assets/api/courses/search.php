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
        `c`.`ID`, 
        `c`.`Name`,
        `f`.`Value`
    FROM `Courses` AS `c` 
    JOIN `Flags` AS `f` ON `c`.`ID`=`f`.`Account ID`
    WHERE POSITION(:term IN CONCAT(
        `c`.`Name`,
        `c`.`ParkName`,
        `c`.`City`,
        `c`.`State`,
        `c`.`Zip`,
        `c`.`Difficulty`
    )) > 0
    ORDER BY `f`.Value*1 DESC LIMIT 50";

    //  Set Values
    $values = array(":term"=>strtolower($payload["term"]));

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (!isset($data)) {
        $return = array("status"=>"error",  "msg"=>"No Courses Found");
    } else {
        $return = array("status"=>"success", "data"=>$data);

    }

    printf(json_encode($return));
?>