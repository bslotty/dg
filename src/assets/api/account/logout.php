<?php session_start();

    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Max-Age: 1000');
    header('Content-Type: application/json,text/plain');

    
    
    //  Load Basic Functions :: For IP Grab
    require ($_SERVER['DOCUMENT_ROOT'] . '/disc/lib/functions.php');
    require ($_SERVER['DOCUMENT_ROOT'] . '/disc/lib/sql.php');
    $sql = new SQL;

    $payload = json_decode(file_get_contents('php://input'), TRUE);

    $return = array();

    //  Query System To Check if Email Exists
    $query = "DELETE FROM `Flags` WHERE `Account ID`=:accountid AND (`Key`='SessionToken' OR `Key`='LastLogon')";

    //  Set Values
    $values = array(":accountid"=>$payload["user"]["id"]);
    
    $data = $sql->Query($query, $values);
    if (!is_array($data)) {
        $return = array("status"=>"error",  "msg"=>"Unable to Unset Session");
    } else {
        $return = array("status"=>"success", "msg"=>"You are now logged out!");
    }

    printf(json_encode($return));
?>