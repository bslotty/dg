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

//  Scores
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
		//	Loop Each Session
		$sessionList = $sessions->getList($payload['start'], $payload['limit'], $payload["user"]);
		if ($sessionList['status'] == 'success') {
			/*
			foreach ($sessionList['results'] as $sK => $s) {
				
				//	Get Scores
				if (strpos($s['format'], "team") != false) {
					$scoreList = $scores->getScoresWithTeams($s);
				} else {
					$scoreList = $scores->getScores($s);
				}

				if ($scoreList['status'] == 'success') {

					if ($scoreList['affectedRows'] > 0) {
						//	Format Scores Data; Update
						$formattedScores = array();
						foreach ($scoreList['results'] as $pK => $p) {
							$formattedScores[] = array(
								'id' 			=> $p["id"],
								'created_on' 	=> $p["created_on"],
								'created_by' 	=> $p["created_by"],
								'modified_on' 	=> $p["modified_on"],
								'modified_by' 	=> $p["modified_by"],
								'score_array' 	=> $p["score_array"],
								'handicap'	 	=> $p["handicap"],
								'team'			=> array(
									"id"		=> $p['teamID'],
									"name"		=> $p['teamName'],
									"color"		=> $p['teamColor']
								),
								'player'		=> array(
									"id"			=> $p['playerID'],
									"first_name"	=> $p['playerFirst'],
									"last_name"		=> $p['playerLast'],
									"first_name"	=> $p['playerEmail'],
								)
							);
						}
					} else {
						$return[] = array(
							'status' 	=> 'error',
							'msg'		=> 'Score List was Empty',
							'sessions'	=> $sessionList,
							'scores'	=> $scoreList
						);
					}


					//	Format Session Data
					$s['scores'] = $formattedScores;

					$return[] = $scoreList;
					$return[] = $formattedScores;
				} else {
					$return[] = array(
						'status' 	=> 'error',
						'msg'		=> 'Failed to retrieve Score List',
						'sessions'	=> $sessionList,
						'scores'	=> $scoreList
					);
				}
			}
			*/

			$return[] = $sessionList;
		} else {
			$return[] = array(
				'status' 	=> 'error',
				'msg'		=> 'Unable to get Session List',
				'sessions'	=> $sessionList
			);
		}



		break;

	case "create":
		//	Verify User
		$user = $player->getPlayerByEmail($payload['user']['email']);
		$return[] = $user;
		if ($user["status"] == "success" && count($user['results']) > 0) {

			//	Generate GUID
			$payload['session']['id'] = $database->generateGUID();

			//	Session Link
			$createdSession = $payload['session'];

			//	Create Session
			$r_createSession = $sessions->create($createdSession, $payload['user']);
			$return[] = $r_createSession;
			if ($r_createSession['status'] == "success" && $r_createSession['affectedRows']  == 1) {

				//	Scores
				$r_createScores = array();
				$teamList = array();
				foreach ($payload["session"]["scores"] as $key => $array) {

					//	Get Unique TeamList if Teams
					if (!empty($array['team'])) {

						//	Create GUID For Team
						$teamID = $database->generateGUID();
						$array['team']['id'] = $teamID;

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


					$r_createScores[] = $scores->create($createdSession, $array, $payload["user"]);
				}

				//	Create Teams if Exist
				if (count($teamList) > 0) {
					$r_createTeams = array();
					foreach ($teamList as $key => $array) {

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
						'msg'		=> 'Scores Created',
						'scores'	=> $r_createScores,
						'results'	=> array($createdSession)
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

	case "detail":
		$sessionDetails = $sessions->getDetails($payload["session"], $payload["user"]);
		if ($sessionDetails['status'] == 'success' && $sessionDetails['affectedRows'] == 1) {
			$session = $sessionDetails["results"][0];

			//	Get Scores
			if (strpos($session['format'], "team") >= 0) {
				$r_scoreList = $scores->getScoresWithTeams($session);
			} else {
				$r_scoreList = $scores->getScores($session);
			}

			if ($r_scoreList['status'] == 'success') {
				if ($r_scoreList['affectedRows'] > 0) {
					//	Format Scores Data; Update
					$formattedScores = array();
					foreach ($r_scoreList['results'] as $pK => $p) {
						$formattedScores[] = array(
							'id' 			=> $p["id"],
							'created_on' 	=> $p["created_on"],
							'created_by' 	=> $p["created_by"],
							'modified_on' 	=> $p["modified_on"],
							'modified_by' 	=> $p["modified_by"],
							'score_array' 	=> $p["score_array"],
							'handicap'	 	=> $p["handicap"],
							'team'			=> array(
								"id"		=> $p['teamID'],
								"name"		=> $p['teamName'],
								"color"		=> json_decode($p['teamColor'])
							),
							'player'		=> array(
								"id"			=> $p['playerID'],
								"first_name"	=> $p['playerFirst'],
								"last_name"		=> $p['playerLast'],
								"first_name"	=> $p['playerEmail'],
							)
						);
					}

					$sessionDetails["results"][0]['scores'] = $formattedScores;
					$return[] = $r_scoreList;
					$return[] = $sessionDetails;

				} else {
					$return[] = array(
						'status' 	=> 'error',
						'msg'		=> 'Score List was Empty',
						'sessions'	=> $sessionDetails,
						'scores'	=> $r_scoreList
					);
				}
			} else {
				$return[] = array(
					'status' 	=> 'error',
					'msg'		=> 'Failed to retrieve Score List',
					'sessions'	=> $sessionList,
					'scores'	=> $scoreList
				);
			}
		} else {
			$return[] = array(
				"status" 	=> "error",
				"msg"		=> "Error getting session be detail",
				"debug"		=> $sessionDetails
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
