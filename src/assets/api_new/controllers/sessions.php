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

//  Session
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/sessions.php');
$sessions = new Session($database);

//  Player
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/players.php');
$player = new Player($database);

//  Permissions
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/scores.php');
$scores = new Score($database);


switch ($payload['action']) {


		/*
	case "recient":
		$return[] = $courses->UserRecientlyPlayed($payload['user']);
		break;

	case "favorites":
		$return[] = $courses->UserFavorites($payload['user']);
		break;

	case "search":
		$return[] = $courses->search($payload['term']);
		break;
		*/

	case "list":
		$return[] = $sessions->getList($payload['start'], $payload['limit'], $payload["user"]);

		break;

	case "create":
		//	Verify User
		$user = $player->getPlayerByEmail($payload['user']['email']);
		$return[] = $user;
		if ($user["status"] == "success" && count($user['results']) > 0) {

			$r_createSession = $sessions->create($payload['session'], $payload['user']);
			$return[] = $r_createSession;
			if ($r_createSession['status'] == "success" && $r_createSession['affectedRows']  == 1) {

				$r_getCreatedSession = $sessions->UserRecientlyCreated($payload['user']);
				$return[] = $r_getCreatedSession;
				if ($r_getCreatedSession['status'] == "success" && $r_getCreatedSession['affectedRows'] > 0) {
					$createdSession = $r_getCreatedSession["results"][0];

					$r_createScores = array();
					$teamList = array();
					foreach ($payload["session"]["scores"] as $key => $array) {
						$r_createScores[] = $scores->create($createdSession, $array, $payload["user"]);

						//	Create a Team
						if (!empty($array['team'])) {

							$dupe = false;
							foreach ($teamList as $key => $team) {
								if ($team['name'] == $array['team']['name']) {
									$dupe = true;
								}
							}

							if (!$dupe) {
								$teamList[] = $array['team'];
							}
						}
					}

					//	Create Teams if Exist
					if (count($teamList) > 0) {
						$r_createTeams = array();
						foreach ($teamList as $key => $array) {

							//	Gen GUID
							$array["id"] = $database->generateGUID();

							//	Create
							$r_createTeams[] = $sessions->createTeam($createdSession, $array, $payload["user"]);
						}

						//	Verify All Teams Were Created
						$r_createTeams_valid = true;
						foreach ($r_createTeams as $key => $array) {
							if ($array["status"] != "success") {
								$r_createTeams_valid = false;
							}
						}

						if ($r_createTeams_valid) {
							$return[] = array(
								'status' 	=> 'success',
								'msg'		=> 'Teams Created'
							);
						} else {
							$return[] = array(
								'status' 	=> 'error',
								'msg'		=> 'Unable to Create Teams',
								'scores'	=> $r_createTeams
							);
						}
					}

					//	Verify All Scores Were Created
					$r_createScores_valid = true;
					foreach ($r_createScores as $key => $array) {
						if ($array["status"] != "success") {
							$r_createScores_valid = false;
						}
					}

					if ($r_createScores_valid) {
						$return[] = array(
							'status' 	=> 'success',
							'msg'		=> 'Scores Created'
						);
					} else {
						$return[] = array(
							'status' 	=> 'error',
							'msg'		=> 'Unable to Create Scores',
							'scores'	=> $r_createScores
						);
					}
				} else {
					$return[] = array(
						'status' 	=> 'error',
						'msg'		=> 'Unable to view Created Session',
						'scores'	=> $r_getCreatedSession
					);
				}
			} else {
				$return[] = array(
					'status' 	=> 'error',
					'msg'		=> 'Unable to Create Session',
					'session'	=> $r_createSession
				);
			}
		} else {
			$return[] = array(
				'status' 	=> 'error',
				'msg'		=> 'Unable to Verify Account'
			);
		}



		break;

	case "update":
		break;

	case "delete":
		break;

	default:
		$return[] = array(
			"status" => "error",
			"msg" => "Unknown Action",
		);
		break;
}


printf(json_encode($return));
