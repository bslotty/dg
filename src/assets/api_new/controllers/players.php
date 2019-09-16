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
				$return["data"][$i++] = array(
					"status" => "success",
					"hash" => $hash
				);

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
			$locatedPlayer = $player->updatePlayer($lostPlayer["results"][0]);
			if ($locatedPlayer["status"] == "success" && count($locatedPlayer['affectedRows']) > 0) {
				//	Setup Email
				require($_SERVER['DOCUMENT_ROOT'] . '/sites/disc/api/shared/email.php');
				$email = new Email();
				$email->formatPasswordResetEmail($lostPlayer["results"][0]["email"], $token);

				//	Send Email
				if ($email->sendEmail()) {
					$return["data"][$i++] = array(
						"status" 	=> "success",
						"msg" 		=> "The next steps have been sent to: " . $lostPlayer["results"][0]['email'],
						"debug"		=> array(
							"locatedPlayer" =>	$locatedPlayer,
							"lostPlayer" 	=>	$lostPlayer
						)
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
					"msg" 		=> "Unable to store token for validation. Please try again."
				);
			}
		} else {
			$return["data"][$i++] = array(
				"status" 	=> "error",
				"msg" 		=> $payload['player']['email'] . " is not associated with an account."
			);
		}
		break;

	case "validate-password-reset":
		//	Forgot Password Email Link takes you to a page that will call this. 
		//	Afterwards goto finalize-password-reset to set the password
		//		May be un-needed and we may be able to just re-use the reset case;
		$playerByToken = $player->verifyToken($payload["token"]);

		if ($playerByToken["status"] == "success" && count($playerByToken["results"]) > 0) {

			//	Validate Expiration Date.
			$exp_date = strtotime($playerByToken["results"][0]["token_exp_date"]);

			if ($exp_date < time()) {

				//	Set New Token for Validation


				$return["data"][$i++] = array(
					"status" 	=> "success",
					"msg" 		=> "Account Validated",
					"player"	=> $playerByToken["results"][0]
				);
			} else {
				$return["data"][$i++] = array(
					"status" 	=> "error",
					"msg" 		=> "Token expired",
					"debug"		=> array(
						"playerByToken" => $playerByToken
					)
				);
			}
		} else {
			$return["data"][$i++] = array(
				"status" 	=> "error",
				"msg" 		=> "Invalid Token",
				"debug"		=> array(
					"playerByToken" => $playerByToken
				)
			);
		}


		break;

	case "verify":
		//	Check Token matches
		$authorizedPlayer 		= $player->verifyToken($payload["token"]);
		$return["data"][$i++] 	= $authorizedPlayer;

		if ($authorizedPlayer["status"] == "success" && count($authorizedPlayer["results"]) > 0) {

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
		$uniquePlayer = $player->getPlayerByEmail($payload["player"]["email"]);
		if ($uniquePlayer["status"] == "success" && count($uniquePlayer["results"]) == 0) {
			$updatedPlayer = $player->updatePlayer($payload["player"]);
			$return["data"][$i++] = $updatedPlayer;

			if ($updatedPlayer["status"] == "success") {
				// Return Player for Token used with requests;
				$return["data"][$i++] = array(
					"status" 	=> "success",
					"msg" 		=> "Account Updated!",
					"data"		=> array(
						"player"	=> $updatedPlayer["results"][0]
					)
				);
			} else {
				// Return Player for Token used with requests;
				$return["data"][$i++] = array(
					"status" 	=> "error",
					"msg" 		=> "Error updating account",
					"data"		=> array(
						"player"	=> $updatedPlayer["results"][0]
					)
				);
			}
		} else {
			// Return Player for Token used with requests;
			$return["data"][$i++] = array(
				"status" 	=> "error",
				"msg" 		=> $uniquePlayer["results"][0]['email'] . " is already associated with an account.",
				"data"		=> array(
					"player"	=> $uniquePlayer["results"][0]
				)
			);
		}



		break;

	case "reset":
		//	Store Values for Replacement
		$old 		= $payload["player"]["password"]["old"];
		$current 	= $payload["player"]["password"]["current"];

		//	Verify Old Pass
		$payload['player']['password'] = $old;
		$oldPassHash = $player->saltPassword($payload["player"]);

		$lostPlayer = $player->getPlayerByEmail($payload["player"]["email"]);

		if ($lostPlayer["results"][0]["password"] == $oldPassHash) {
			//	Update Pass
			$lostPlayer["results"][0]["password"] = $current;

			//	Salt Password
			$lostPlayer["results"][0]["password"] = $player->saltPassword($lostPlayer["results"][0]);

			//	Update Account
			$return["data"][$i++] = $player->updatePlayer($lostPlayer["results"][0]);

			/*
			$return["data"][$i++] = array(
				"status" 	=> "error",
				"msg" 		=> "DEBUG",
				"debug"		=> array(
					"oldPassHash" 	=> $oldPassHash,
					"lostPlayer" 	=> $lostPlayer,
					"hash"			=> $lostPlayer["results"][0]['password'] . '1337' . strtolower($lostPlayer["results"][0]["email"])
				)
			);
			*/
		} else {
			$return["data"][$i++] = array(
				"status" 	=> "error",
				"msg" 		=> "Invalid Old Password",
				"debug"		=> array(
					"oldPassHash" 	=> $oldPassHash,
					"lostPlayer" 	=> $lostPlayer,
					"hash"			=> $lostPlayer["results"][0]['password'] . '1337' . strtolower($lostPlayer["results"][0]["email"])
				)
			);
		}
		break;

	case "password-set":
		//	Store Values for Replacement
		$current 	= $payload["player"]["password"]["current"];

		//	Verify Old Pass
		$payload['player']['password'] = $current;
		$passHash = $player->saltPassword($payload["player"]);

		$verifiedPlayer = $player->getPlayerByEmail($payload["player"]["email"]);

		if ($verifiedPlayer["status"] == "success" && count($playerByToken["results"]) > 0) {
			$playerByToken["results"][0]["password"] = $passHash;

			//	Update Account
			$return["data"][$i++] = $player->updatePlayer($playerByToken["results"][0]);
		} else {
			// Return Player for Token used with requests;
			$return["data"][$i++] = array(
				"status" 	=> "error",
				"msg" 		=> "Unable to update account information.",
				"data"		=> array(
					"player"	=> $verifiedPlayer["results"][0]
				)
			);
		}



		break;

	case "detail":
		$return["data"][$i++] = $player->getDetail($payload["player"]["id"]);
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



/*
if ($devMode) {
	printf();
} else {
	//	Only Return last action if not in dev mode;
	printf(json_encode($return["data"][$i]));
}
*/

printf(json_encode($return));
