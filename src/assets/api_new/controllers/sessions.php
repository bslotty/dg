<?php
//	Session & Header Init
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/headers.php');

//  Convert HTTP Vars
$payload = json_decode(file_get_contents('php://input'), TRUE);

//  Init Return
$return = array();

/**
 * 	Get Team List From Score Array
 * 	@param $scores: Scores
 * 	@return Team[]
 */
function GetUniqueTeams($scores){
	$teamList = array();
	foreach ($scores as $key => $array) {

		//	Get Unique TeamList if Teams
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

	return $teamList;
}


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

//  Courses
require_once($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/courses.php');
$courses = new Course($database);

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
			$return[] = $sessionList;

			//	Map for formatting session-format
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
				$teamList = GetUniqueTeams($payload["session"]["scores"]);
				

				//	Create Teams if Exist
				if (count($teamList) > 0) {
					$r_createTeams = array();
					foreach ($teamList as $key => $array) {

						//	Create GUID For Team
						$teamID = $database->generateGUID();
						$teamList[$key]['id'] = $teamID;

						//	Create
						$r_createTeams[] = $sessions->createTeam($createdSession, $teamList[$key], $payload["user"]);
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
							'msg'		=> 'Teams Created',
							'debug'		=> $r_createTeams,
							'teamList'	=> $teamList
						);
					} else {
						$return[] = array(
							'status' 	=> 'error',
							'msg'		=> 'Unable to Create Teams',
							'teams'	=> $r_createTeams
						);
					}
				}



				


				//	Scores
				foreach ($payload["session"]["scores"] as $key => $array) {
					//	Update Team Ids
					if (count($teamList) > 0) {
						foreach ($teamList as $key => $ta) {
							if ($array["team"]["name"] == $ta["name"]) {
								$array["team"]["id"] = $ta["id"];
							}
						}
					}

					$r_createScores[] = $scores->create($createdSession, $array, $payload["user"]);
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

			//	Get Course
			$r_getCourse = $courses->getDetails($session["course_id"]);
			$return[] = $r_getCourse;
			if ($r_getCourse['status'] == 'success' && $r_getCourse['affectedRows'] == 1) {

				//	Set Course
				$sessionDetails["results"][0]["course"] = $r_getCourse['results'][0];

				//	Get Scores
				if (strpos($session['format'], "team") === false) {
					$r_scoreList = $scores->getScores($session);
				} else {
					$r_scoreList = $scores->getScoresWithTeams($session);
				}
				$return[] = $r_scoreList;

				//	Format Scores
				if ($r_scoreList['status'] == 'success' && $r_scoreList['affectedRows'] > 0) {

					$formattedScores = array();
					foreach ($r_scoreList['results'] as $pK => $p) {
						$formattedScores[] = array(
							'id' 			=> $p["scores.id"],
							'created_on' 	=> $p["scores.created_on"],
							'created_by' 	=> $p["scores.created_by"],
							'modified_on' 	=> $p["scores.modified_on"],
							'modified_by' 	=> $p["scores.modified_by"],
							'score_array' 	=> json_decode($p["scores.score_array"]),
							'handicap'	 	=> $p["scores.handicap"],

							'team'			=> array(
								"id"		=> $p['team.id'],
								"name"		=> $p['team.name'],
								"color"		=> json_decode($p['team.color'])
							),
							
							'player'		=> array(
								"id"			=> $p['player.id'],
								"first_name"	=> $p['player.first_name'],
								"last_name"		=> $p['player.last_name'],
								"email"			=> $p['player.email']
							)
						);
					}

					//	Replace Scores with format
					$sessionDetails["results"][0]['scores'] = $formattedScores;
					$return[] = $sessionDetails;

				} else {
					$return[] = array(
						'status' 	=> 'error',
						'msg'		=> 'Failed to retrieve Score List',
						'sessions'	=> $sessionDetails,
						'scores'	=> $scoreList
					);
				}
			} else {
				$return[] = array(
					"status" 	=> "error",
					"msg"		=> "Failed to retrieve Course",
					"debug"		=> $sessionDetails
				);
			}
		} else {
			$return[] = array(
				"status" 	=> "error",
				"msg"		=> "Failed to retrieve Session",
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
