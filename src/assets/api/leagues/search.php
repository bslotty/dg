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
    $term = $payload["term"];

    $return = array();

    //  Get List of Leagues for User
    $query = "  SELECT
                    `l`.`ID`, 
                    `l`.`Name`,
                    LOWER(
                        CONCAT(
                            `l`.`Name`,';',
                            `l`.`Description`
                        )
                    ) AS `Search`,
                    `l`.`Visibility`,
                    `l`.`Description`,
                    `l`.`Restrictions`
                FROM `Leagues` AS `l`
                WHERE `l`.`Visibility`='public'
                HAVING `Search` LIKE CONCAT('%%', :term, '%%')
                LIMIT 50";

    //  Set Values
    $values = array(
        ":term" => strtolower($term)
    );

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (!isset($data)) {
        $return = array(
            "status"    => "error",  
            "msg"       => "No Leagues Found",
            "data"      => array()
        );
    } else {

        $payload = [];
        foreach($data as $k => $o) {
            $payload[] = array(
                "id"            => $o['ID'],
                "name"          => $o['Name'],
                "visibility"    => $o['Visibility'],
                "restrictions"  => $o['Restrictions'],
                "description"   => $o['Description']
            );
        }
        

        $return = array(
            "status"    => "success", 
            "data"      => array("leagues" => $payload) /*,
            "debug"     => $data,
            "query"     => $query,
            "term"      => $term
            */
        );

    }

    printf(json_encode($return));


    /*      Test Query
            Ambitious: Can Impliment Later
    "SELECT
        `l`.`ID`, 
        `l`.`Name`,
        `f`.`Value`,
        CONCAT(
        `l`.`Name`,';',
        `c`.`Name`,';',
        `c`.`ParkName`,';',
        `c`.`City`,';',
        `c`.`State`,';',
        `c`.`Zip`,';',
        `c`.`Difficulty`,';',
        `l`.`Description`
    ) AS `Search`
    FROM `Leagues` AS `l`
    JOIN `Sessions` AS `s` ON `s`.`LeagueID`=`l`.`ID`
    JOIN `Courses` AS `c` ON `c`.`ID`=`s`.`CourseID`
    JOIN `Flags` AS `f` ON `c`.`ID`=`f`.`Account ID`
    WHERE POSITION(:term IN CONCAT(
        `l`.`Name`,';',
        `c`.`Name`,';',
        `c`.`ParkName`,';',
        `c`.`City`,';',
        `c`.`State`,';',
        `c`.`Zip`,';',
        `c`.`Difficulty`,';',
        `l`.`Description`
    )) > 0 && `l`.`Name` != 'Your Solo League' && `f`.`key` = 'CourseViews'
    ORDER BY `f`.Value*1 DESC LIMIT 50";


    */
?>