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


    //  Set Flag Insert Query
    $query = "UPDATE `Accounts` SET `First`=:first, `Last`=:last WHERE `ID`=:account";

    //  Set Values
    $values = array(
        ":first"    => ucfirst($payload["user"]["first"]),
        ":last"     => ucfirst($payload["user"]["last"]),
        ":account"  => $payload["user"]["id"]
    );

    $data = $sql->Query($query, $values);
    if (!is_array($data)) {
        $return = array(
            "status"    => "error", 
            "msg"       => "Unable to update account"
        );
    } else {
        $return = array(
            "status"    =>  "success", 
            "msg"       => "Your account information has been updated.",
                "data"      => array(
                    "user"      => array(
                        "id"    => $payload["user"]["id"],
                        "first" => $payload["user"]["first"],
                        "last"  => $payload["user"]["last"],
                        "email" => ""
                    )
                )
                    );
    }

    printf(json_encode($return));
    
?>