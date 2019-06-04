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


    //  Get Values From HTTP
    $payload    = json_decode(file_get_contents('php://input'), TRUE);
    $return     = array();


    if (isset($payload['token']) ) {
        //  Find Forgot Password Request
        $query = "SELECT `ID`, `Account ID` FROM `Flags` WHERE `Key`='ForgotPassword' AND `Value`=:value LIMIT 1";
        
        //  Set Values
        $values = array(":value" => $payload["token"]);

        $data = $sql->Query($query, $values);
        if (count($data) == 0) {
            $return = array(
                "status"=>"error", 
                "msg"=>"Unable to find request",
                "data"=>$data);
        } else {

            //  Get Timestamp from ID
            $time = substr($data[0]["ID"], 0, 10);

            //  Verify Token isnt older than 10 mins
            if ($time < strtotime("-10 minutes")) {
                $return = array("status"=>"error", "msg"=> "Request expired. Please send another request.");
            } else {

                //  Delete Forgot Password Requests
                $query = "DELETE FROM `Flags` WHERE `Key`='ForgotPassword' AND `Account ID`=:id";
                
                $accountID = $data[0]["Account ID"];

                //  Set Values
                $values = array(":id" => $accountID);

                $data = $sql->Query($query, $values);
                if (!isset($data)) {
                    $return = array("status"=>"error", "msg"=> "Unable to reset requests", "data"=>$data);
                } else {

                    //  Find Account
                    $query = "SELECT * FROM `Accounts` WHERE `ID`=:id LIMIT 1";
                    
                    //  Set Values
                    $values = array(":id" => $accountID);

                    $data = $sql->Query($query, $values);
                    if (count($data) == 0) {
                        $return = array("status"=>"error", "msg"=> "Unable to find account.");
                    } else {
                        $return = array(
                            "status"    => "success", 
                            "msg"       => "Enter a new password", 
                            "data"      => array(
                                "user"      => array(
                                    "id"        =>  $data[0]["ID"],
                                    "first"     =>  $data[0]["First"],
                                    "last"      =>  $data[0]["Last"],
                                    "email"     =>  $data[0]["Email"]
                                )  
                            )
                        );
                    }
                }
            }
        }
    } else {
        $return = array("status"=>"error", "msg"=> "Data not set");
    }


    
    printf(json_encode($return));
    
?>