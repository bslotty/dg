<?php
//	Session & Header Init
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/headers.php');

//  Convert HTTP Vars
$payload = json_decode(file_get_contents('php://input'), TRUE);

//  Init Headers
$return = array(
	"request-type" => $_SERVER['REQUEST_METHOD']
);

//	Counter for Return Data
$i = 0;

//	Debug
/**
 * Future feature, do not return each step in DB; only return last; Can flag with this later on
 */
$devMode = true;

//  DB
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/sql.php');
$database = new DB;

//  Player
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/courses.php');
$courses = new Course($database);


switch ($payload['action']) {
	case "list":
		$return["data"][$i++] = $courses->getList($payload['start'], $payload['limit']);

		break;

	case "search":
		$return["data"][$i++] = $courses->getList($payload['term']);
		break;

	case "create":
		break;

	case "update":
		break;

	case "delete":
		break;

	default:
		$return["data"][$i++] = array(
			"status" => "error",
			"code" => "500",
			"phase" => "setup",
			"msg" => "Unknown Action",
		);
		break;
}


printf(json_encode($return));
