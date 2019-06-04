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
    $query = "INSERT INTO `Stats` 
    (`ID`, `AccountID`, `SessionID`, `TeamID`, `Throws`) VALUES 
    (:id, :account, :session, :team, :throws)";

    $payload["id"] = date("U") . rand(100000, 999999);

    //  Store ID For Return
    $statsID = $payload["id"];
    
    //  Set Values
    $values = array(
        ":id"        => $statsID,
        ":account"   => $payload['player']['id'],
        ":session"   => $payload['session']['id'],
        ":team"      => $payload['team']['id'],
        ":throws"    => '[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]'
    ); 

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if ($data === false) {
        $return = array("status"=>"error", "msg"=>"Unable to add player");
    } else {

        $return = array(
            "status"    =>"success", 
            "msg"       =>"Player Successfully Added!", 
            "insertID"  =>$statsID
        );
    }

    printf(json_encode($return));
?>