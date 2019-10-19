<?php
//	Session & Header Init
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/headers.php');

//  Convert HTTP Vars
$payload = json_decode(file_get_contents('php://input'), TRUE);

//  Init Return
$return = array();

//	Debug
/**
 * Future feature, do not return each step in DB; only return last; Can flag with this later on
 */
$devMode = true;

//  DB
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/sql.php');
$database = new DB;

//  Course
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/Favorites.php');
$favorite = new Favorite($database);

//  Course
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/players.php');
$player = new Player($database);


switch ($payload['action']) {
    case "create":
        //  Verify Table/ID Combo Doesnt Exist
        $favList = $favorite->userList($player);
        if ($favList["status"] == "success") {
            $exists = false;

            //  Loop to Check Dupes
            foreach ($favList["results"] as $key => $ar) {
                if (
                    $ar["related_table"] == $payload["favorite"]["related_table"] &&
                    $ar["related_id"] == $payload["favorite"]["related_id"]
                ) { 
                    $exists = true;
                }
            }

            //  Write Fav
            if ($exists == false) {
                $return[] = $favorite->create($payload["favorite"], $user);
            }
        }

        

        break;

    case "delete":
        $return[] = $favorite->delete($payload["favorite"]);
        break;

    default:
        $return[] = array(
            "status" => "error",
            "msg" => "Unknown Action",
        );
        break;
}


printf(json_encode($return));
