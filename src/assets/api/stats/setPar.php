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

        $query = "DELETE FROM `Flags` WHERE `Account ID`=:session AND `Key`='SessionParArray' LIMIT 1;";
        $values = array(
            ":session" => $payload["session"]["id"]
        );        

        
        $data = $sql->Query($query, $values);
        if (!is_array($data)) {
            $return = array(
                "status"    =>  "error",  
                "msg"       =>  "Unable to Delete Session, but whyyy",
                "data"      =>  $data
            );
        } else {
            $query = "INSERT INTO `Flags` (`ID`, `Account ID`, `Key`, `Value`) VALUES (:id, :session, 'SessionParArray', :par);";
            
            $values = array(
                ":id"       => date("U") . rand(100000, 999999),
                ":session"  => $payload["session"]["id"],
                ":par"      => $payload["par"]
            );    

            $data = $sql->Query($query, $values);
            if (!is_array($data)) {
                $return = array(
                    "status"    =>  "error",  
                    "msg"       =>  "Some errors occured while updating the Par",
                    "data"      =>  $data
                );  
            } else {
                $return = array(
                    "status" => "success",  
                    "msg"    => "Par Updated",  
                    "data"   => array()
                );
            }
        }
    }

    printf(json_encode($return));
?>