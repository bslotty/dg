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

    /*
    printf ("<pre>");
    var_dump($payload);
    printf ("</pre>");
    */

    /*
        Process:
            Get Session Drivers(IsDone/IsStarted)

            if both false -> Create new by:
                Delete All Session Stats

                Create new Entries for Each User


            if IsStarted == true and IsDone == false -> Update Existing
    */

    $query = "SELECT * FROM `Sessions` WHERE `ID`=:session LIMIT 1;";
    $values = array(
        ":session" => strtolower($payload["session"]["id"])
    );        

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array(
            "status"    =>  "error",  
            "msg"       =>  "Session not found",
            "data"      =>  array()
        );
    } else {

        //  New -> Delete any existing -> Create
        if ($data[0]['IsDone'] == "0" && $data[0]['IsStarted'] == "0") {
            
            $query = 'DELETE FROM `Stats` WHERE `SessionID`=:session;';
            $values = array(
                ":session" => strtolower($payload["session"]["id"])
            );        
        
            $sql = new SQL;
            $data = $sql->Query($query, $values);
            if (!is_array($data)) {
                $return = array(
                    "status"    =>  "error",  
                    "msg"       =>  "Error clearing existing data",
                    "data"      =>  $data
                );
            } else {

                $query = "INSERT INTO `Stats` (`ID`, `AccountID`, `SessionID`, `Scores`) VALUES (:id, :account, :session, '[]')";

                //  flag to flip if any query fails
                $bulk = true;
                foreach($payload["roster"] as $k => $o) {

                    //  Only Store Active Users
                    if ($o["status"] == true) {
                        $values = array(
                            ":id"       => date("U") . rand(100000, 999999),
                            ":account"  => strtolower($o['user']["id"]),
                            ":session"  => strtolower($payload["session"]["id"])
                        );        
                    
                        $sql = new SQL;
                        $data = $sql->Query($query, $values);
                        if (!is_array($data)) {
                            $bulk = false;
                        }
                    }
                }

                if ($bulk == true) {
                    $return = array(
                        "status" => "success",  
                        "msg"    => "Roster Setup!",  
                        "data"   => array()
                    );
                } else {
                    $return = array(
                        "status"    =>  "error",  
                        "msg"       =>  "Some errors occured while storing the Roster",
                        "data"      =>  $data,
                        "values"    =>  $values
                    );  
                }
            }


        //  Begun -> Update Stats
        } else if ($data[0]['IsDone'] == "0" && $data[0]['IsStarted'] == "1") {
            
            $query = "UPDATE `Stats` SET `Scores`=:scores WHERE `AccountID`=:account AND `SessionID`=:session ;";
            
            //  flag to flip if any query fails
            $bulk = true;
            foreach($payload["roster"] as $k => $o) {
                $values = array(
                    ":scores"   => strtolower($o["scores"]),
                    ":account"  => strtolower($o["user"]["id"]),
                    ":session"  => strtolower($payload["session"]["id"])
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

        //  Finalized; Unable to Alter
        } else {
            $return = array(
                "status"    =>  "error",  
                "msg"       =>  "Session has already been started",
                "data"      =>  array()
            );   
        }
    }

    printf(json_encode($return));
?>