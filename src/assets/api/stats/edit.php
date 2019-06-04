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

        $query = "  UPDATE `Stats` SET `Throws`=:throws WHERE `AccountID`=:account AND `SessionID`=:session ;
                    UPDATE `Pars` SET `Par`=:par WHERE `SessionID`=:session; ";
        
        //  flag to flip if any query fails
        $bulk = true;
        foreach($payload["roster"] as $k => $o) {
            $values = array(
                ":throws"   => $o["throwString"],
                ":account"  => $o["user"]["id"],
                ":session"  => $payload["session"]["id"],
                ":par"      => $payload["session"]["parString"]
            );        
        
            $sql = new SQL;
            $data = $sql->Query($query, $values);
            if (!is_array($data)) {
                $bulk = false;
            }
        } 

        if ($bulk == true) {
            $return = array(
                "status" => "success",  
                "msg"    => "Scores Updated",  
                "data"   => array()
            );
        } else {
            $return = array(
                "status"    =>  "error",  
                "msg"       =>  "Some errors occured while updating the Scores",
                "data"      =>  $data
            );  
        }
    }

    printf(json_encode($return));
?>