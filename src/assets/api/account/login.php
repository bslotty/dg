<?php session_start();

    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Max-Age: 1000');
    header('Content-Type: application/json,text/plain');

    $URL = "http://www.brandonslotty.com/disc/";
    //$URL = "http://localhost:4200/";

    //  Convert HTTP Payload to PHP Array
    $payload = json_decode(file_get_contents('php://input'), TRUE);

    //  Setup Feedback
    $return = array();

    //  Verify Data Set Properly
    if ($payload["user"]["email"] == null) {
        $return = array(
            "status"    => "error",  
            "msg"       => "Improper Data",
            "data"      => null
        );
    } else {
         //  Load Basic Functions :: For IP Grab
        require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/functions.php');
        require ($_SERVER['DOCUMENT_ROOT'] . '/api/disc/sql.php');

        //  Query System To Check if Email Exists
        $query = "SELECT * FROM `Accounts` WHERE `Email`=:email LIMIT 1";

        //  Set Values
        $values = array(":email"=>strtolower($payload["user"]["email"]));

        $sql = new SQL;
        $data = $sql->Query($query, $values);
        if (count($data) == 0) {
            $return = array(
                "status" =>"error",  
                "msg"    =>"Account not found",
                "data"   => null
            );
        } else {

            //  Store User Information for Later Use
            $user = $data[0];

            //  Verify if endpoint is trusted
            $trusted = false;
            $valid   = true;
            $hash    = hash("sha512", getRealIpAddr());

            //  Query System For Account Flags
            $query = "SELECT * FROM `Flags` WHERE `Account ID`=:account;";

            //  Values
            $values = array(":account" => $user["ID"]);
            $data = $sql->Query($query, $values);
            foreach ($data as $ka => $a) {

                //  Compare IP to Trusted List
                if ($a["Value"] == $hash && $a["Key"] == "PreviousIP") {
                    $trusted = true;
                }

                //  Check Validation Token Flag
                if ($a["Value"] == $payload["user"]["validationToken"] && $a["Key"] == "ValidationToken"){
                    $trusted = true;
                }

                //  Check for pending verification
                if ($a["Key"] == "AccountVerification") {
                    $valid = false;
                }
            }

            // If Validation already pending
            if ($valid == false) {
                $return = array(
                    "status" => "error", 
                    "msg"    => "Account needs to be verified. Please check your email for the verification link.",
                    "data"   => null
                );
            
            //  If endpoint IP is not trusted -> validate
            } else if ($trusted == false){

                //  Set Token
                $hash = hash("sha512", date("YmdHis:U") . getRealIpAddr() . "1337" . $user["ID"]);
            
                //  Set Flag Insert Query
                $query = "INSERT INTO `Flags` (`ID`, `Account ID`, `Key`, `Value`) VALUES (:id, :account, 'AccountVerification', :value);";

                //  Set Values
                $values = array(
                    ":id"           => date("U") . rand(100000, 999999), 
                    ":account"      => $user["ID"],
                    ":value"        => $hash 
                );

                $data = $sql->Query($query, $values);
                if (!is_array($data)) {
                    $return = array(
                        "status" => "error", 
                        "msg"    => "Unable to store validation token",
                        "data"   => null
                    );
                    
                } else {
                    //  Send Email
                    $to         = $user["Email"];
                    $subject    = "DGC Account Verification";
                    $message    = "<html style='color: rgb(80,100,80) !IMPORTANT;'><body>";
                    $message   .= "<h1>DGC</h1><h3>Verify Your Account</h3>";
                    $message   .= "<p>Click <a href='".$URL."account/verify/".$hash."/'>Here</a> "; 
                    $message   .= "to verify your account. If you did not initiate this request, ignore this message.</p>";
                    $message   .= "</body></html>";

                    // Always set content-type when sending HTML email
                    $headers    = "MIME-Version: 1.0" . "\r\n";
                    $headers   .= "Content-type:text/html;charset=UTF-8" . "\r\n";

                    // More headers
                    $headers   .= 'From: <no-reply@bsdisc.com>' . "\r\n";
                    if (mail($to, $subject, $message, $headers)){
                        $return = array(
                            "status" =>"error", 
                            "msg"    =>"Account needs to be verified. Please check your email for the verification link.",
                            "data"   => null
                        );
                    } else {
                        $return = array(
                            "status" => "error", 
                            "msg"    => "Unable to send verification email",
                            "data"   => null,
                        );
                    }
                }
            
            //  Endpoint trusted
            } else {

                $str = $payload["user"]["pass"]["current"] . "1337" . strtolower($payload["user"]["email"]);
                $hash = hash("sha512", $str);

                /*  Debug
                printf("Debug:<pre>");
                var_dump($payload);
                var_dump($user);
                printf("Hash: %s<br>:", $hash);
                printf ("</pre>");
                */

                // Compare Password to encryption
                if ($hash != $user["Password"]) {
                    $return = array(
                        "status"=> "error",
                        "msg"   => "Invalid Password",
                        "hash"  => $hash,
                        "pass"  => $user["Password"]
                    );   
                } else {


                    /*
                    // Insert Session Cookie into DB
                    $sid = session_id();
                    $query = "INSERT INTO `Flags` (`ID`, `Account ID`, `Key`, `Value`) VALUES (:id, :accountid, :key, :value);";
                    
                    //  Set Session Token
                    $values = [];
                    $values[] = array(
                        ":id"           => date("U") . rand(100000, 999999), 
                        ":accountid"    => $user["ID"],
                        ":key"          => "ValidationToken",
                        ":value"        => $sid 
                    );

                    //  Set Login Timestamp
                    $values[] = array(
                        ":id"           => date("U") . rand(100000, 999999), 
                        ":accountid"    => $user["ID"],
                        ":key"          => "LastLogon",
                        ":value"        => date("U")
                    );

                    

                    $data1 = $sql->Query($query, $values[0]);
                    $data2 = $sql->Query($query, $values[1]);
                    if (!is_array($data1) && !is_array($data2)) {
                        $return = array(
                            "status" =>"error", 
                            "msg"    =>"Unable to store session flags",
                            "data"   => null    
                        );
                        
                    } else {
                    */
                        $return = array(
                            "status" =>"success", 
                            "msg"    =>"You are now logged in",
                            "data"      => array(
                                "user"      => array(
                                    "id"        =>  $user["ID"],
                                    "first"     =>  $user["First"],
                                    "last"      =>  $user["Last"],
                                    "email"     =>  $user["Email"]
                                )
                            )
                        );
                    // }
                }
            }
        }
    }
   
    //  Return Payload
    printf( json_encode($return) );

?>