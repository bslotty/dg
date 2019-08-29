<?php
//	Session & Header Init
require($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/headers.php');

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
require($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/sql.php');
$database = new DB;

//  Player
require($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/classes/players.php');
$player = new Player($database);

//  Return Payload
/*
require($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/payload.php');
$payload = new Player($database);
*/

switch ($payload['action']) {
	case "register":

		//	Email has to be unique
		$potentalPlayer = $player->getPlayerByEmail($payload["player"]["email"]);
		$return["data"][$i++] = $potentalPlayer;
		if ($potentalPlayer["status"] == "success" && count($potentalPlayer["results"]) == 0) {

			//	Create New Player! Yay!
			$registeredPlayer = $player->registerPlayer($payload["player"]);
			$return["data"][$i++] = $registeredPlayer;


			//	Send Verification Email;
			if ($registeredPlayer["status"] == "success") {

				//	Setup Email
				require($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/email.php');
				$email = new Email();
				$email->formatVerificationEmail($registeredPlayer["results"][0]["email"], $token);

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
		} else {
			$return["data"][$i++] = array(
				"status" => "error",
				"msg" => "An account is already associated with: " . $payload["player"]["email"]
			);
		}
		break;

	case "login":

		$foundPlayer = $player->getPlayerByEmail($payload["player"]["email"]);
		$return["data"][$i++] = $foundPlayer;
		if ($foundPlayer["status"] == "success" && count($foundPlayer['results']) > 0) {

			//	Compare password;
			$hash = $player->saltPassword($payload["player"]);

			//	Invalid Pass?
			if ($foundPlayer["results"][0]["password"] != $hash) {
				$return["data"][$i++] = array(
					"status" => "error",
					"msg"   => "Invalid Password",
					"hash"	=> $hash
				);

				//	Need to Verify?
			} else if ($foundPlayer["results"][0]["last_login"] == null) {
				//	Verify
				$token = $player->generateToken($payload["player"], "verify");

				//	Setup Email
				require($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/email.php');
				$email = new Email();
				$email->formatVerificationEmail($payload["player"]["email"], $token);

				//	Send Email
				if ($email->sendEmail()) {
					$return["data"][$i++] = array(
						"status" => "error",
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
				$foundPlayer["results"][0]["last_login"] = date("c");

				//	Update Auth Token
				$foundPlayer["results"][0]["token"] = $player->generateToken($payload["player"], "login");
				$foundPlayer["results"][0]["token_expires_on"] = null;

				//	Update Token & Login
				$return["data"][$i++] = $player->updatePlayer($foundPlayer["results"][0]);
			}
		} else {
			$return["data"][$i++] = array(
				"status" => "error",
				"msg" => $payload['player']['email'] . " is not associated with an account."
			);
		}
		break;

	case "search":
		$return["data"][$i++] = $player->searchPlayers($payload["term"]);


		break;

	case "initate-password-reset":
		$lostPlayer				= $player->getPlayerByEmail($payload['player']['email']);
		$return["data"][$i++] 	= $lostPlayer;

		if ($lostPlayer["status"] == "success" && count($lostPlayer['results']) > 0) {

			//	Set Token
			$token = $player->generateToken($lostPlayer["results"][0], 'forgot');
			$lostPlayer["results"][0]["token"] = $token;
			$lostPlayer["results"][0]["token_expires_on"] = $player->getTokenExpDate();

			//	Update Player
			$locatedPlayer = $player->updatePlayer($lostPlayer);

			//	Setup Email
			require($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/email.php');
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
		$authorizedPlayer 		= $player->verifyToken($payload["token"]);
		$return["data"][$i++] 	= $authorizedPlayer;

		if ($authorizedPlayer["status"] == "success" && count($authorizedPlayer["results"]) > 0 ) {

			//	Update Tokens
			$authorizedPlayer["results"][0]["token"] 				= $player->generateToken($authorizedPlayer["results"][0], "login");
			$authorizedPlayer["results"][0]["token_expires_on"] 	= $player->getTokenExpDate();
			$authorizedPlayer["results"][0]["last_login"] 			= date("c");

			// Update Player
			$updatedPlayer = $player->updatePlayer($authorizedPlayer["results"][0]);
			$return["data"][$i++] = $updatedPlayer;

			if ($updatedPlayer["status"] == "success" && $updatedPlayer["affectedRows"] == 1) {
				// Return Player for Token used with requests;
				$return["data"][$i++] = array(
					"status" 	=> "success",
					"msg" 		=> "Account Verified!",
					"data"		=> array(
						"player"	=> $authorizedPlayer["results"][0]
					)
				);
			} else {
				$return["data"][$i++] = array(
					"status" 	=> "error",
					"msg" 		=> "Unable to update account. Please try to initiate the request again."
				);
			}
			
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
				"player"	=> $authorizedPlayer["results"][0]
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



/*
if ($devMode) {
	printf();
} else {
	//	Only Return last action if not in dev mode;
	printf(json_encode($return["data"][$i]));
}
*/

printf(json_encode($return));
