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



    //  Get Account ID from Verification Request
    $query = "SELECT * FROM `Flags` WHERE `Value`=:value AND `Key`='AccountVerification' LIMIT 1";
    
    //  Set Values
    $values = array(":value" => $payload["token"]);

    
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array(
            "status"=>"error", 
            "msg"=>"Verification not found",
            "data"=>$data
        );  
    } else {

        //  Store Account ID
        $accountID  = $data[0]["Account ID"];

        //  Get Account Information for Return Login
        $query = "SELECT * FROM `Accounts` WHERE `ID`=:accountid";
        
        //  Set Values
        $values = array(
            ":accountid"    => $accountID,
        );

        $data = $sql->Query($query, $values);
        if (!is_array($data)) {
            $return = array("status"=>"error", "msg"=>"Unable to get user information"); 
        } else {

            //  Set Account for Return
            $user = $data[0];
            $sid = session_id();

            //  Insert Account Flags
            $query = "INSERT INTO `Flags` (`ID`, `Account ID`, `Key`, `Value`) VALUES (:id, :accountid, :key, :value);";
            $values = array();

            //  Insert IP for Account Verification
            $values[] = array(
                ":id"           => date("U") . rand(100000, 999999), 
                ":accountid"    => $accountID,
                ":key"          => 'PreviousIP',
                ":value"        => hash("sha512", getRealIpAddr())
            );

            
            //  Insert Validation Token for Persistant Account
            $values[] = array(
                ":id"           => date("U") . rand(100000, 999999), 
                ":accountid"    => $accountID,
                ":key"          => 'ValidationToken',
                ":value"        => $sid
            );


            /*
            //  Insert Login Time for Account Timeout
            $values[] = array(
                ":id"           => date("U") . rand(100000, 999999), 
                ":accountid"    => $accountID,
                ":key"          => 'LastLogon',
                ":value"        => date("U")
            );
            */

            //  Insert Each Flag
            $insertFail = false;
            foreach ($values as $array) {
                $data = $sql->Query($query, $array);
                if (!is_array($data)) {
                    $insertFail = true;
                }
            }

            if ($insertFail) {
                $return = array("status"=>"error", "msg"=>"Unable to store account properties", "values"=>json_encode($values)); 
            } else {

                //  Delete Previous Verification Requests
                $query = "DELETE FROM `Flags` WHERE `Account ID`=:id  AND `Key`='AccountVerification';";
        
                //  Set Values
                $values = array(":id" => $accountID);

                $data = $sql->Query($query, $values);
                if (!is_array($data)) {
                    $return = array("status"=>"error", "msg"=>"Unable to remove account verification lock"); 
                } else {

                    //  If Solo League Doesnt Exist; Create
                    $query = "SELECT * 
                    FROM `Leagues` AS `l`
                    JOIN `Permissions` AS `p` ON `l`.`ID`=`p`.`LeagueID`
                    WHERE `p`.`UserID`=:accountid AND `l`.`Visibility`='solo' 
                    LIMIT 1";  

                    //  Set Values
                    $values = array(":accountid" => $accountID);

                    $data = $sql->Query($query, $values);
                    if (count($data) == 0) {

                        //  Create Private League if not found
                        $query = "INSERT INTO `Leagues` (`ID`, `Name`, `Visibility`) VALUES (:id, 'Your Solo League', 'solo');";

                        $leagueID = date("U") . rand(100000, 999999);

                        //  Set Values
                        $values = array(
                            ":id"           => $leagueID
                        );

                        $data = $sql->Query($query, $values);
                        if (!is_array($data)) {
                            $return = array("status"=>"error", "msg"=>"Unable to create private league"); 
                        } else {

                            //  Insert Into Permissions
                            $query = "INSERT INTO `Permissions` (`ID`, `LeagueID`, `UserID`, `Level`, `Status`) VALUES (:id, :leagueid, :accountid, 'creator', 'approved');";

                            //  Set Values
                            $values = array(
                                ":id"          => date("U") . rand(100000, 999999), 
                                ":leagueid"    => $leagueID,
                                ":accountid"   => $accountID
                            );

                            $data = $sql->Query($query, $values);
                            if (!is_array($data)) {
                                $return = array("status"=>"error", "msg"=>"Unable to set permissions for private league"); 
                            } else {
                                $return = array(
                                    "status"=>"success", 
                                    "msg"=>"Account verified!", 
                                    "data"      => array(
                                        "user"      => array(
                                            "id"        =>  $user["ID"],
                                            "first"     =>  $user["First"],
                                            "last"      =>  $user["Last"],
                                            "email"     =>  $user["Email"]
                                        )
                                    )
                                ); 
                            }   
                        } 
                    } else {
                        $return = array(
                            "status"=>"success", 
                            "msg"=>"Account verified!", 
                            "data"      => array(
                                "user"      => array(
                                    "id"        =>  $user["ID"],
                                    "first"     =>  $user["First"],
                                    "last"      =>  $user["Last"],
                                    "email"     =>  $user["Email"]
                                )
                            )
                        ); 
                    }
                }
            }
        }
    }

    printf(json_encode($return));

?>


