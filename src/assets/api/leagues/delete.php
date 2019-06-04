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

    //  Verify Permissions
    $validUser = $sql->Access($payload["league"], $payload["user"]);
    if ($validUser["status"] == "error") {
        $return = array(
            "status"=>"error",  
            "msg"=>"You do not have sufficent permissions to perform this action"
        );
    } else {

        //  Delete Session with ID
        $query = "DELETE FROM `Leagues` WHERE `ID`=:id";
                                    
        //  Set Values
        $values = array(
            ":id"   =>  $payload['league']['id']
        );

        $data = $sql->Query($query, $values);
        if ($data === FALSE) {
            $return = array(
                "status"    => "error",  
                "msg"       => "League not Found", 
                "data"      => array()
            );
        } else if (getType($data) == "string"){
            $return = array(
                "status"    => "error",  
                "msg"       => "SQL Error", 
                "data"      => $data
            );  
        } else {
            $return = array(
                "status"    => "success", 
                "msg"       => "League Removed", 
                "data"      => $data
            );
        }



        
    }

    printf(json_encode($return));
?> 