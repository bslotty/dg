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

    //  Get List of Leagues for User
    $query = "SELECT 
        `l`.`ID` AS `LeagueID`,
        `l`.`Name` AS `Name`,
        `l`.`Visibility` AS `Visibility`,
        `l`.`Description` AS `Description`,
        `l`.`Restrictions` AS `Restrictions`,
        `p`.`ID` AS `PermissionID`,
        `p`.`UserID` AS `UserID`,
        `p`.`Level` AS `Level`,
        `p`.`Status` AS `Status`
    FROM `Leagues` AS `l`
    JOIN `Permissions` AS `p` ON `p`.`LeagueID`=`l`.`ID` 
    WHERE `l`.`ID`=:league AND `p`.`UserID`=:user
    ORDER BY `p`.`Level`;";

    //  Set Values
    $values = array(
        ":league" =>  $payload["league"]["id"],
        ":user"   =>  $payload["user"]["id"]
    );

    $sql = new SQL;
    $data = $sql->Query($query, $values);
    if (count($data) == 0) {
        $return = array(
            "status"=>"error",  
            "msg"=>"Nothing Returned", 
            "data" => array()
        );
    } else {
        $return = array(
            "status" =>"success",  
            "data"   => array(
                "id" => $data[0]['LeagueID'],
                "name" => $data[0]['Name'],
                "visibility" => $data[0]['Visibility'],
                "description" => $data[0]['Description'],
                "restrictions" => $data[0]['Restrictions'],
                "level" => $data[0]['Level']
            )/*, 
                "permission" => array(
                    "id" => $data[0]['PermissionID'],
                    "league" => array("id"=>$data[0]['LeagueID']),
                    "user" => array("id"=>$data[0]['UserID']),
                    "level" => $data[0]['Level'],
                    "status" => $data[0]['Status']
                )   */
        );

    }

    printf(json_encode($return));

    /*  Types
        export class League {
            public userLevel: string;

            constructor(
                public id: string,
                public name: string,
                public visibility: string,
                public description?: string,
                public restrictions?: string,
            ) {}
        } 

        export class Permission {
            constructor(
                public id: string,
                public league: League,
                public user: User,
                public level: string,
                public status: string,
            ) {}
        }
*/

?>