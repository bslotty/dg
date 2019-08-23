<?php

/*
	Purpose
	Handle any authorization, including any tokens involved in the process;

	Need to Verify Account
		When:
			Account Created

		Why:
			Data Validity Verification

		How:
			Send Email
			Verify Token

		What:
			Player Class needed
				player.token = Stored Value (Generated upon Registration)
				player.token_expires_on = Stored Value (Set upon Registration to now + 3hrs)
				player.last_login = null
		


	Need to Verify Forgot Password Request
		When:
			User Form Submitted

		Why:
			User Requested

		How:
			Send Email
			Verify Token

		What:
			Play Class needed
				player.token = New Gen
				player.token_expires_on = now + 3hrs


	
	Any DB Handle
		When:
			Any HTTP Request is called

		Why: 
			Authorization

		How:
			Return Boolean if token matches localStorage token; (Set upon login)

		What:
			Player Class needed
				player.token = Stored Value (Generated upon login)
				player.token_expires_on = null 

*/
class Auth
{
	public $db;
	public $con;

	//  Init
	public function __construct($db)
	{
		$this->db = $db;
		$this->con = $db->getConnection();
	}


	/**
	 * @param Player $item
	 * @param string $type		verify | forgot_password | login
	 */
	public function generateToken($item, $type)
	{
		$str 	= $item["id"] . $item["created_on"] . 'DGC' . $item["email"] . 'Slots' . $item["last_name"] . 'WAAAGH!!' . $type;
		$token 	= hash('sha512', $str);

		return $token;
	}

	/**
	 * @param Player $player
	 */
	public function saltPassword($player)
    {
        return hash("sha512", 'plains' . $player["email"] . 'mountain' . $player["password"] . 'island');
    }

	/**
	 * @param Player $player
	 */
	public function login($player)
	{ 
		//	hash
		$hash = $this->saltPassword($player);

		//	query
		$query = "SELECT * FROM `Players` WHERE `Email`=:email and `Password`=:hash LIMIT 1";

		//	data
		$values = array(
			":email" => $player["email"],
			":hash" => $hash
		);

		return $this->db->Query($query, $values);
	}


	/**
	 * @param Player $item
	 */
	public function verifyToken($item)
	{
		$query = "SELECT
			`id`,
			`first_name`,
			`last_name`,
			`email`,
		FROM `Players`
		WHERE POSITION(:term IN CONCAT(
			`first_name`,
			`last_name`,
			`email`,
		)) > 0
		ORDER BY `modified_on` DESC 
		LIMIT 10";

		$values = array(
			":term"	=> $term
		);

		return $this->db->Query($query, $values);
	}

	public function setToken()
	{ }
}
