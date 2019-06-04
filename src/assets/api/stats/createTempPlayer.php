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

        $userID =  date("U") . rand(100000, 999999);

        //  Insert for Stats Table
        $query = " INSERT INTO `Accounts` (`ID`, `First`, `Last`, `Email`, `Password`) VALUES 
                        (:id, :first, :last, :email, :pass)";

        $values = array(
            ":id"       => $userID,
            ":first"    => $payload["tempPlayer"]["first"],
            ":last"     => "temp",
            ":email"    => "temp",
            ":pass"     => $payload["session"]["id"]
        );        
            
        $sql = new SQL;
        $data = $sql->Query($query, $values);

        if ($data === false) {
            $return = array(
                "status"    =>  "error",  
                "msg"       =>  "Unable to Create Temporary Player"
            );  

        } else {
            $return = array(
                "status"    =>  "success",  
                "msg"       =>  "Temporary Player Created",
                "insertID"  =>  $userID
            );  
        }


        
    }

    printf(json_encode($return));
?>