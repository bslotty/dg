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

//	Counter for Return Data
$i = 0;

//	Debug
/**
 * Future feature, do not return each step in DB; only return last; Can flag with this later on
 */
$devMode = true;

//  DB
require($_SERVER['DOCUMENT_ROOT'] . '/sites/dgc2/api/shared/sql.php');
$database = new DB;

//  Player
require($_SERVER['DOCUMENT_ROOT'] . '/sites/dgc2/api/classes/players.php');
$player = new Player($database);

//  Return Payload
require($_SERVER['DOCUMENT_ROOT'] . '/sites/dgc2/api/shared/payload.php');
$player = new Player($database);

switch ($payload['action']) {
	case "register":
		$registeredPlayer = $player->registerPlayer($payload["player"]);
		$return["data"][$i++] = $registeredPlayer;


		//	Send Verification Email;
		if ($registeredPlayer["status"] == "success") {

			//	Setup Email
			$email = new Email();
			$email->formatVerificationEmail($registeredPlayer["data"]["email"], $token);

			//	Send Email
			if ($email->sendEmail()) {
				$return["data"][$i++] = array(
					"status" => "success",
					"msg" => "Account needs to be verified. Please check your email."
				);
			} else {
				$return["data"][$i++] = array(
					"status" => "error",
					"msg" => "Unable to send verification email."
				);
			}
		} else {
			$return["data"][$i++] = array(
				"status" => "error",
				"msg" => "Unable to register account."
			);
		}

		break;

	case "login":

		$foundPlayer = $player->getPlayerByEmail($payload["player"]["email"]);
		$return["data"][$i++] = $foundPlayer;
		if ($foundPlayer["status"] == "success") {

			//	Compare password;
			$hash = $player->saltPassword($player);

			//	Invalid Pass?
			if ($foundPlayer["data"]["password"] != $hash) {
				$return["data"][$i++] = array(
					"status" => "error",
					"msg"   => "Invalid Password"
				);

				//	Need to Verify?
			} else if ($foundPlayer["data"]["last_login"] == null) {
				//	Verify
				$token = $player->generateToken($player, "verify");

				//	Setup Email
				$email = new Email();
				$email->formatVerificationEmail($payload["player"]["email"], $token);

				//	Send Email
				if ($email->sendEmail()) {
					$return["data"][$i++] = array(
						"status" => "success",
						"msg" => "Account needs to be verified. Please check your email."
					);
				} else {
					$return["data"][$i++] = array(
						"status" => "error",
						"msg" => "Unable to send verification email."
					);
				}
			} else {
				//	yay! Login
				//	Set Last Login to Now
				$foundPlayer["data"]["last_login"] = date("U");

				//	Update Auth Token
				$foundPlayer["data"]["token"] = $player->generateToken($player, "login");
				$foundPlayer["data"]["token_expires_on"] = null;

				//	Update Token & Login
				$return["data"][$i++] = $player->updatePlayer($foundPlayer["data"]);
			}
		} else {
			$return["data"][$i++] = array(
				"status" => "error",
				"msg" => "Email not found."
			);
		}
		break;

	case "search":
		$return["data"][$i++] = $player->searchPlayers($payload["term"]);


		break;

	case "initate-password-reset":
		$lostPlayer				= $player->getPlayerByEmail($payload['player']['email']);
		$return["data"][$i++] 	= $lostPlayer;

		if ($lostPlayer["status"] == "success") {

			//	Set Token
			$token = $player->generateToken($lostPlayer["data"], 'forgot');
			$lostPlayer["data"]["token"] = $token;
			$lostPlayer["data"]["token_expires_on"] = $player->getTokenExpDateExpDate();

			//	Update Player
			$locatedPlayer = $player->updatePlayer($lostPlayer);

			//	Setup Email
			$email = new Email();
			$email->formatPasswordResetEmail($player["email"], $token);

			//	Send Email
			if ($email->sendEmail()) {
				$return["data"][$i++] = array(
					"status" 	=> "success",
					"msg" 		=> "The next steps have been sent to: " . $payload['player']['email']
				);
			} else {
				$return["data"][$i++] = array(
					"status" 	=> "error",
					"msg" 		=> "Unable to send verification email."
				);
			}
		} else {
			$return["data"][$i++] = array(
				"status" 	=> "error",
				"msg" 		=> $payload['player']['email'] . " is not associated with an account."
			);
		}
		break;

	case "verify":
		//	Check Token matches
		$authorizedPlayer 		= $player->verifyToken($payload["player"]);
		$return["data"][$i++] 	= $authorizedPlayer;

		if ($authorizedPlayer["status"] == "success") {

			//	Update Tokens
			$authorizedPlayer["data"]["token"] 				= $player->generateToken($payload["player"], "login");
			$authorizedPlayer["data"]["token_expires_on"] 	= $player->getTokenExpDateExpDate();
			$authorizedPlayer["data"]["last_login"] 		= date("U");

			// Update Player
			$return["data"][$i++] = $player->updatePlayer($authorizedPlayer["data"]);

			// Return Player for Token used with requests;
			$return["data"][$i++] = array(
				"status" 	=> "success",
				"msg" 		=> "Account Verified!",
				"data"		=> array(
					"player"	=> $authorizedPlayer["data"]
				)
			);
		} else {
			$return["data"][$i++] = array(
				"status" 	=> "error",
				"msg" 		=> "Invalid Request."
			);
		}
		break;

	case "update":
		$return["data"][$i++] = $player->updatePlayer($payload["player"]);

		// Return Player for Token used with requests;
		$return["data"][$i++] = array(
			"status" 	=> "success",
			"msg" 		=> "Account Verified!",
			"data"		=> array(
				"player"	=> $authorizedPlayer["data"]
			)
		);
		break;

	case "reset":
		//	set password? isnt it just an update? Salt new Password? 
		$return["data"][$i++] = $player->updatePlayer($payload["player"]);
		break;


	case "detail":
		$return["data"][$i++] = $player->getDetail($payload["player"]["id"]);
		break;

	default:
		$return["data"][$i++] = array(
			"status" => "error",
			"code" => "500",
			"phase" => "setup",
			"message" => "Unknown Action",
		);
		break;
}




if ($devMode) {
	printf(json_encode($return));
} else {
	//	Only Return last action if not in dev mode;
	printf(json_encode($return[count($return)]));
}
