<?php
//  Session
session_start();

//  Headers
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, X-Requested-With');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Max-Age: 1000');
header('Content-Type: application/json,text/plain');

//  Convert HTTP Vars
$payload = json_decode(file_get_contents('php://input'), TRUE);

//  Init Headers
$return = array(
	"request-type" => $_SERVER['REQUEST_METHOD']
);

//  DB
require($_SERVER['DOCUMENT_ROOT'] . '/sites/dgc2/api/shared/sql.php');
$database = new DB;

//  Player
require($_SERVER['DOCUMENT_ROOT'] . '/sites/dgc2/api/classes/players.php');
$player = new Player($database);



switch ($payload['action']) {
	case "register":
		$return["data"][0] = $player->registerPlayer($payload["player"]);
		break;

	case "login":
		$return["data"] = $player->login($payload["player"]);
		break;

	case "search":

		//  Defaults
		if (!isset($payload["start"])) {
			$payload["start"] = 0;
		}

		if (!isset($payload["limit"])) {
			$payload["limit"] = 100;
		}

		$return["data"][0] = $meals->getList($payload["start"], $payload["limit"]);
		break;

	case "update":
		//  Delete
		foreach ($payload["meals"] as $index => $array) {
			if ($array["id"] != "create") {
				$return["data"][$index] = $meals->delete($array["id"]);
			}
		}

		//  Create New
		foreach ($payload["meals"] as $index => $array) {
			$return["data"][$index] = $meals->create($array);
		}

		$return["data"][count($return["data"])] = $meals->getList();
		break;


	case "detail":
		$return["data"][0] = $meals->getDetail($payload["id"]);
		break;

	default:
		$return["data"]["status"] = "error";
		$return["data"]["code"] = "500";
		$return["data"]["phase"] = "setup";
		$return["data"]["message"] = "Unknown route";
		break;
}





printf(json_encode($return));
