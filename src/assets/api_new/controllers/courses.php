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
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/courses.php');
$courses = new Course($database);

//  Course
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/players.php');
$player = new Player($database);


switch ($payload['action']) {
	case "list":
		$return[] = $courses->getList($payload['start'], $payload['limit']);

		break;

	case "search":
		$return[] = $courses->search($payload['term']);
		break;

	case "create":
		//	Verify User
		$user = $player->getPlayerByEmail($payload['user']['email']);
		$return[] = $user;
		if ($user["status"] == "success" && count($user['results']) > 0) {
			//	Verify no Course within +/- .005 of lat/lng
			//	$return[] = $courses->nearBy($payload['course']);
			
			$course = $courses->ConvertFrontBack($payload['course']);

			//	Create Course
			$created = $courses->create($course, $user['results'][0]);
			$return[] = $created;
			if ($created['status'] == 'success' && $created["affectedRows"] == 1) {

				//	Return ID for Detail View
				//	$return[] = $database->lastInsertId();
			}
		}



		break;

	case "update":
		break;

	case "delete":
		break;

	default:
		$return[] = array(
			"status" => "error",
			"code" => "500",
			"phase" => "setup",
			"msg" => "Unknown Action",
		);
		break;
}


printf(json_encode($return));
