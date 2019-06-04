<?php session_start();

    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Max-Age: 1000');
    header('Content-Type: application/json,text/plain');

    $URL = "http://www.brandonslotty.com/disc/";
    //$URL = "http://localhost:4200/";
    
    //  Load Basic Functions :: For IP Grab
    require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/functions.php');
    require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/sql.php');
    $sql = new SQL;

    //  Get Values From HTTP
    $payload    = json_decode(file_get_contents('php://input'), TRUE);
    $return     = array();

    //  Verify Data
    if (isset($payload['user']['email'])) {

        //  Get ID From Email
        $query = "SELECT `ID`, `Email` FROM `Accounts` WHERE `Email`=:email LIMIT 1";
        
        //  Set Values
        $values = array(":email" => strtolower($payload["user"]["email"]));
        
        
        $data = $sql->Query($query, $values);
        if (count($data) == 0) {
            $return = array("status"=>"error", "msg"=>"Email not associated with any account");
        } else {

            //  Store Account ID from found account to link forgot password flag
            $accountID = $data[0]["ID"];

            //  Insert ForgotPassword Token Into Table
            $string     = date("YmdHis:U") . getRealIpAddr() . "1337" . strtolower($payload["user"]["email"]);      
            $hash       = hash("sha512", $string);


            //  Set Flag Insert Query
            $query = "INSERT INTO `Flags` (`ID`, `Account ID`, `Key`, `Value`) VALUES (:id, :accountid, 'ForgotPassword', :value);";

            //  Set Values
            $values = array(
                ":id"           => date("U") . rand(100000, 999999), 
                ":accountid"    => $accountID, 
                ":value"        => $hash 
            );


            $data = $sql->Query($query, $values);
            if (!is_array($data)) {
                $return = array("status"=>"error", "msg"=>"Unable to store Token");
            } else {
                //  Send Email To Verify Account
                $to         = $payload["user"]["email"];
                $subject    = "DG Forgot Password";
                $message    = "<html stayle='color: rgb(80,100,80) !IMPORTANT;'><body>";
                $message   .= "<h1>BS Disc</h1><h3>Verify Your Account</h3>";
                $message   .= "<p>Click <a href='".$URL."account/forgot/".$hash."'>Here</a> "; 
                $message   .= "to reset your password. If you did not initiate this request, ignore this message.</p>";
                $message   .= "</body></html>";

                // Always set content-type when sending HTML email
                $headers    = "MIME-Version: 1.0" . "\r\n";
                $headers   .= "Content-type:text/html;charset=UTF-8" . "\r\n";

                // More headers
                $headers   .= 'From: <no-reply@bsdisc.com>' . "\r\n";
                if (mail($to, $subject, $message, $headers)){
                    $return = array(
                        "status"=>"success", 
                        "msg"=>"An email has been sent to ". $payload["user"]["email"] ." for further instructions on how to reset your password.");
                } else {
                    $return = array(
                        "status"=>"error", 
                        "msg"=>"Unable to send email. Please try again.");
                }
            }
        }
    } else {
        $return = array("status"=>"error", "msg"=>"Data not properly set");
    } 

    printf(json_encode($return));

?>