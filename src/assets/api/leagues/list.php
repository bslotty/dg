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
    $query = "SELECT * 
    FROM `Leagues` AS `l`
    JOIN `Permissions` AS `p` ON `p`.`LeagueID`=`l`.`ID` 
    WHERE `p`.`UserID`=:userid AND (`p`.`Status`='approved')
    ORDER BY `p`.`Level` ASC, `p`.`Status` ASC, `l`.`ID` ASC;";

    //  Set Values
    $values = array(":userid"=>strtolower($payload["user"]["id"]));

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (!isset($data)) {
        $return = array("status"=>"error",  "msg"=>"No Leagues Found");
    } else {

        $payload = [];
        foreach($data as $k => $o) {
            $payload[] = array(
                "id"            => $o['LeagueID'],
                "name"          => $o['Name'],
                "visibility"    => $o['Visibility'],
                "restrictions"  => $o['Restrictions'],
                "description"   => $o['Description'],
                "level"         => $o['Level'],
            );
        }
        

        $return = array(
            "status"    => "success", 
            "data"      => array("leagues" => $payload),
            "debug"    => $data
        );
    }

    printf(json_encode($return));
?>