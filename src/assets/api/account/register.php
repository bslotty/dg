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



    //  Check If Email Exists in Account Table
    $query = "SELECT `ID`, `Email` FROM `Accounts` WHERE `Email`=:email LIMIT 1";
    
    //  Set Values
    $values = array(":email" => $payload["user"]["email"]);
    
    $data = $sql->Query($query, $values);
    if (count($data) > 0) {
        $return = array("status"=>"error", "msg"=>"The email entered is already associated with an account");
    } else {

    
        //  Create New Account
        $query = "INSERT INTO `Accounts` (`ID`, `First`, `Last`, `Email`, `Password`) VALUES (:id, :first, :last, :email, :pass);";
        
        //  Hash Pass
        $string = $payload["user"]["pass"]["current"] . "1337" . strtolower($payload["user"]["email"]);
        $hash = hash("sha512", $string);

        //  Store Account ID
        $accountID = date("U") . rand(100000, 999999);

        //  Set Values
        $values = array(
            ":id"           => $accountID, 
            ":first"        => ucfirst($payload["user"]["first"]), 
            ":last"         => ucfirst($payload["user"]["last"]), 
            ":email"        => strtolower($payload["user"]["email"]),
            ":pass"         => $hash
        );

        $data = $sql->Query($query, $values);
        if (!is_array($data)) {
            $return = array("status"=>"error", "msg"=>"Unable to create account");
        } else {

            //  Hash AccountVerification
            $string = date("YmdHis:U") . getRealIpAddr() . "1337" . strtolower($payload["user"]["email"]);
            $hash = hash("sha512", $string);

            //  Set Flag Insert Query
            $query = "INSERT INTO `Flags` (`ID`, `Account ID`, `Key`, `Value`) VALUES (:id, :accountid, 'AccountVerification', :value);";

            //  Set Values
            $values = array(
                ":id"           => date("U") . rand(100000, 999999), 
                ":accountid"    => $accountID,
                ":value"        => $hash 
            );


            $data = $sql->Query($query, $values);
            if (!is_array($data)) {
                $return = array("status"=>"error", "msg"=>"Unable to create account properties");
            } else {


                //  Send Email To Verify Account
                $to         = $payload["user"]["email"];
                $subject    = "DG Account Verification";
                $message    = "<html style='color: rgb(80,100,80) !IMPORTANT;'><body>";
                $message   .= "<h1>BS Disc</h1><h3>Verify Your Account</h3>";
                $message   .= "<p>Click <a href='". $URL ."account/verify/".$hash."'>Here</a> "; 
                $message   .= "to verify your account. If you did not initiate this request, ignore this message.</p>";
                $message   .= "</body></html>";

                // Always set content-type when sending HTML email
                $headers    = "MIME-Version: 1.0" . "\r\n";
                $headers   .= "Content-type:text/html;charset=UTF-8" . "\r\n";

                // More headers
                $headers   .= 'From: <no-reply@bsdisc.com>' . "\r\n";
                if (mail($to, $subject, $message, $headers)){
                    $return = array("status"=>"success", "msg"=>"Account needs to be verified. Please check your email.");
                } else {
                    $return = array("status"=>"error", "msg"=>"Unable to send email");
                }
            }
        }
    }

    printf(json_encode($return));
?>