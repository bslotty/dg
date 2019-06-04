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

    //  Create
    $query = "INSERT INTO `Leagues` (`ID`, `Name`, `Visibility`, `Restrictions`, `Description`) VALUES (:id, :name, :visibility, :restrictions, :description)";

    $payload["id"] = date("U") . rand(100000, 999999);

    //  Store ID For Return
    $leagueID = $payload["id"];
    
    //  Set Values
    $values = array(
        ":id"               => $leagueID,
        ":name"             => $payload['league']['name'],
        ":visibility"       => $payload['league']['visibility'],
        ":restrictions"     => $payload['league']['restrictions'],
        ":description"      => $payload['league']['description']
    ); 

    //  var_dump($values);

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if ($data === false) {
        $return = array("status"=>"error", "msg"=>"Unable to create League");
    } else {

        //  Set Permissions for Creator on this league when Create.
        $query = "INSERT INTO `Permissions` (`ID`, `LeagueID`, `UserID`, `Level`, `Status`) VALUES (:id, :league, :user, 'creator', 'approved')";
        $values = array(
            ":id"=> date("U") . rand(100000, 999999),
            ":league"=> $leagueID,
            ":user"=> $payload["user"]["id"]
        );

        $data = $sql->Query($query, $values);
        if ($data === false) {
            $return = array("status"=>"error", "msg"=>"Unable to create permissions");
        } else {
            $return = array(
                "status"    =>"success", 
                "msg"       =>"You have successfully created your league!", 
                "insertID"  =>$leagueID
            );
        }
    }

    printf(json_encode($return));
?>