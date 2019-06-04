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

        $query = "UPDATE `Stats` SET `AccountID`=:existing WHERE `SessionID`=:session AND `AccountID`=:temp;
        DELETE FROM `Accounts` WHERE `ID`=:temp;";
                        
        $values = array(
            ":existing" => $payload["player"]["id"],
            ":session"  => $payload["session"]["id"],
            ":temp"     => $payload["temp"]["id"]
        );

        $data = $sql->Query($query, $values);
        if (!is_array($data)) {
            $return = array(
                "status"    =>  "error",  
                "msg"       =>  "Unable to Merge Players",
                "data"      =>  array()
            );
        } else {

            $return = array(
                "status"    =>  "success",  
                "msg"       =>  "Players Successfully Merged!",
                "data"      =>  array()
            );
        }
    }





        /*  Old Security Checks
            Temp Account
                [ACCOUNTS]  Verify it is a tempAccount by pass=='temp'
                [STATS]     Verify that tempAccount exists in Session Stats


            Existing Account
                [ACCOUNTS]  Verify it is a registered account,
                [STATS]     Verify it is not in Session Stats
        


        //  Verify Accounts
        $query = "SELECT * FROM `Accounts` WHERE `ID`=:temp OR `ID`=:existing LIMIT 2";
        $values = array(
            ":temp"     => $payload["merge"]["temp"]["id"],
            ":existing" => $payload["merge"]["existing"]["id"]
        );
        $data = $sql->Query($query, $values);
        if (count($data) == 0) {
            $return = array(
                "status"    =>  "error",  
                "msg"       =>  "Provided accounts not found",
                "data"      =>  $data
            );
        } else {
            $valid = true;

            
            foreach($data as $o) {
                //  Temp
                if ($o["ID"] == $payload["merge"]["temp"]["id"] && $o["Password"] != $payload["session"]['id']) {
                    $valid = false;

                    $return = array(
                        "status"    =>  "error",  
                        "msg"       =>  "Temp Account not Valid",
                        "data"      =>  array()
                    ); 
                }

                //  Existing
                if ($o["ID"] == $payload["merge"]["existing"]["id"] && ( $o['Password'] == $payload["session"]['id'] || $o['Email'] == "temp" ) )  {
                    $valid = false;

                    $return = array(
                        "status"    =>  "error",  
                        "msg"       =>  "Existing Account not Valid",
                        "data"      =>  array()
                    ); 
                }
            }



            if ($valid != true) { 
                //  errors are handeled above 
            } else {

                //  Verify Session Stats
                $query = "SELECT * FROM `Stats` WHERE `SessionID`=:session";
                
                $values = array(
                    ":session" => $payload["session"]["id"]
                );
        
                $data = $sql->Query($query, $values);
                if (count($data) == 0) {
                    $return = array(
                        "status"    =>  "error",  
                        "msg"       =>  "Session not found",
                        "data"      =>  array()
                    );
                } else {
                    //  Temp
                    $tempValid = false;
                    foreach($data as $o) {
                        if ($o["AccountID"] == $payload["merge"]["temp"]["id"]) {
                            $tempValid = true;
                        }
                    }

                    //  Existing
                    $existingValid = true;
                    foreach($data as $o) {
                        if ($o["AccountID"] == $payload["merge"]["existing"]["id"]) {
                            $existingValid = false;
                        }
                    }

                    //  If Any Errors
                    if ($tempValid != true || $existingValid != true) {
                        $return = array(
                            "status"    =>  "error",  
                            "msg"       =>  "Session Stats not valid",
                            "temp"      =>  $tempValid,
                            "exisiting" =>  $existingValid
                        );
                    } else {

                        //  SAFE ZONE -> MERGE!
                        $query = "UPDATE `Stats` SET `AccountID`=:existing WHERE `SessionID`=:session AND `AccountID`=:temp";
                        
                        $values = array(
                            ":existing" => $payload["merge"]["existing"]["id"],
                            ":session"  => $payload["session"]["id"],
                            ":temp"     => $payload["merge"]["temp"]["id"]
                        );
                
                        $data = $sql->Query($query, $values);
                        if (!is_array($data)) {
                            $return = array(
                                "status"    =>  "error",  
                                "msg"       =>  "Unable to Merge Stats",
                                "data"      =>  array()
                            );
                        } else {

                            //  Delete Temp Account 
                            $query = "DELETE FROM `Accounts` WHERE `ID`=:temp";
                            
                            $values = array(
                                ":temp"     => $payload["merge"]["temp"]["id"]
                            );
                    
                            $data = $sql->Query($query, $values);
                            if (!is_array($data)) {
                                $return = array(
                                    "status"    =>  "error",  
                                    "msg"       =>  "Unable to Remove Temp Account",
                                    "data"      =>  array()
                                );
                            } else {
                                $return = array(
                                    "status"    =>  "success",  
                                    "msg"       =>  "Stats Successfully Merged!",
                                    "data"      =>  array()
                                );
                            }
                        }
                    }
                }
            }
            
        }
        
    }
    */

    printf(json_encode($return));
?>