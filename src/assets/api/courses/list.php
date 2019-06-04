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

    $section = $payload['sort'];
    $query = "";

    switch ($section) {
        case "pop":
            $query = "SELECT * FROM `Courses` AS `c` JOIN `Flags` AS `f` ON `c`.`ID`=`f`.`Account ID` WHERE `f`.`key`='CourseViews' ORDER BY `f`.Value*1 DESC LIMIT 50;";
        break;

        case "asc":
            $query = "SELECT * FROM `Courses` ORDER BY `Name` ASC LIMIT 50;";
        break;

        case "desc":
            $query = "SELECT * FROM `Courses` ORDER BY `Name` DESC LIMIT 50;";
        break;

        case "near":
        break;

        default:
            $query = "SELECT * FROM `Courses` ORDER BY `Name` ASC LIMIT 0;";
        break;
    }


    //	PDO SELECT
    if ($query != "") {

        //  Set Values
        $values = array();
    
        $data = $sql->Query($query, $values);
        if (count($data) == 0) {
            $return = array(
                "status"    =>  "error", 
                "message"   =>  "No Courses Found."
            );
        } else {

            $payload = [];
            foreach($data as $k => $o) {
                $payload[] = array(
                    "id"            => $o['ID'],
                    "locationKey"   => $o['LocationKey'],
                    "parkName"      => $o['ParkName'],
                    "name"          => $o['Name'],
                    "img"           => $o['IMGPath'],
                    "city"          => $o['City'],
                    "state"         => $o['State'],
                    "zip"           => $o['Zip'],
                    "latitude"      => $o['Latitude'],
                    "longitude"     => $o['Longitude'],
                    "difficulty"    => $o['Difficulty'],
                    "holeCount"     => $o['HoleCount']
                );
            }
            

            $return = array(
                "status"    => "success", 
                "data"      => array("courses" => $payload),
                "debug"    => $data
            );
        }
    }


    printf(json_encode($return));


    /*  Data Model
        export class Course {
        constructor(
            public id: string,
            public name?: string,
            public park?: string,
            public difficulty?: string,
            public holes?: string,
            public img?: string,
            public address?: Address,
        ){}
        }

        export class Address {
        constructor(
            public city: string,
            public state: string,
            public zip: string,
            public lat?: string,
            public lng?: string,
            public address?: string,
        ){}
        }
    */
?>