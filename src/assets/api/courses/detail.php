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

    /*  Track Number of Views
            Reason:
                - Help drive the popularity section on the List view

            How: Set Flag to Increment Value on View

            Process:
                - Search for Popularity Key in Flag Table
                - If None Found -> Create; (For expansion of unknown amount of courses)
                - If Found -> Update with Incremented Value;
    */
    //  Check if entry already Exists to drive Update/Insert
    $query  = "SELECT * FROM `Flags` WHERE `Account ID`=:course AND `Key`='CourseViews' LIMIT 1;";
    $values = array(":course" => $payload['course']['id']);
   
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $query = "INSERT INTO `Flags` VALUES (:id, :course, 'CourseViews', '1');";
        $values = array(
            ":id" => date("U") . rand(100000, 999999),
            ":course" => $payload['course']['id']
        );
        $sql->Query($query, $values);
    } else {
        $query = "UPDATE `Flags` SET `Value`=:value WHERE `ID`=:id";
        $values = array(
            ":id"       => $data[0]["ID"],
            ":value"    => ($data[0]["Value"] + 1)
        );
        $sql->Query($query, $values);
    }
    
    //  Get List of Leagues for User
    $query = "SELECT *
    FROM `Courses`
    WHERE `ID`=:course;";

    //  Set Values
    $values = array(
        ":course" =>  $payload['course']['id']
    );
    
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array(
            "status"=>"error",  
            "msg"=>"Nothing Returned", 
            "data" => array()
        );
    } else {
        $return = array(
            "status"=>"success",  
            "data"=> array(
                "course" => array(
                    "id"            => $data[0]['ID'],
                    "locationKey"   => $data[0]['LocationKey'],
                    "parkName"      => $data[0]['ParkName'],
                    "name"          => $data[0]['Name'],
                    "img"           => $data[0]['IMGPath'],
                    "city"          => $data[0]['City'],
                    "state"         => $data[0]['State'],
                    "zip"           => $data[0]['Zip'],
                    "lat"           => $data[0]['Latitude'],
                    "lng"           => $data[0]['Longitude'],
                    "difficulty"    => $data[0]['Difficulty'],
                    "holeCount"     => $data[0]['HoleCount']
                )
            )
        );

    }
    
    printf(json_encode($return));
    
    //  $googleMapHtml      = require ($_SERVER['DOCUMENT_ROOT'] . '/disc/views/gmap.php'/*?lat="'.$lat.'"&?lng="'.$lng.'"'*/);
    //  $weatherHtml        = require ($_SERVER['DOCUMENT_ROOT'] . '/disc/views/weather-daily.php');
    //  $courseStatsHtml    = require ($_SERVER['DOCUMENT_ROOT'] . '/disc/views/course-stats.php');

?>