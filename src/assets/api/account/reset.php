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


    //  Get Values From HTTP
    $payload    = json_decode(file_get_contents('php://input'), TRUE);
    $return     = array();

    //  Verify Data            
    if (    isset($payload['user']['id']) && 
            isset($payload['user']["email"]) &&
            isset($payload['user']["pass"]["current"])  ) {
        
        //  Convert Password
        $string = $payload["user"]["pass"]["current"] . "1337" . strtolower($payload['user']['email']);
        $hash = hash("sha512", $string);

        //  Set Flag Insert Query
        $query = "UPDATE `Accounts` SET `Password`=:pass WHERE `ID`=:account";

        //  Set Values
        $values = array(
            ":pass"     => $hash,
            ":account"  => $payload['user']['id']
        );

        $data = $sql->Query($query, $values);
        if (!is_array($data)) {
            $return = array("status"=>"error", "msg"=> "Unable to update password", "values"=>$values);
        } else {
            $return = array("status"=>"success", "msg"=> "Your password has been updated.");
        }
    } else {
        $return = array("status"=>"error", "msg"=> "Data not properly set");
        
    }


    printf(json_encode($return));
    
?>