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
$database = new DB("scores");

//  Scores
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/scores.php');
$scores = new Score($database);

//  Players
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/players.php');
$player = new Player($database);


switch ($payload['action']) {
	case "list":
		$return[] = $scores->getScores($payload['start'], $payload['limit']);

		break;

	case "recient":
		$return[] = $scores->RecientlyPlayedWith($payload['user']);
		break;

	case "search":
		$return[] = $player->searchPlayers($payload['term']);
		break;
}



printf(json_encode($return));
