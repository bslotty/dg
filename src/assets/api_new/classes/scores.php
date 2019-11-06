<?php

class Score
{

	//	Properties
	public $id;
	public $created_by;
	public $created_on;
	public $modified_by;
	public $modified_on;
	public $session_id;
	public $team_id;
	public $player_id;
	public $score_array;
	public $handicap;
					

	//	DB
	public $db;
	public $con;

	//  Init
	public function __construct($db)
	{
		$this->db = $db;
		$this->con = $db->getConnection();
	}

	
	public function create($session, $score, $user)
	{

		$query = "INSERT INTO `Scores` 
		(`id`, `created_by`, `created_on`, `modified_by`, `modified_on`, `session_id`, `team_id`, `player_id`, `score_array`, `handicap`  ) VALUES 
		(:id, :created_by, :created_on, :modified_by, :modified_on, :session_id, :team_id, :player_id, :score_array, :handicap );";

		$values = array(
			':id' 			=> $this->db->generateGUID(),
			':created_by' 	=> $user['id'],
			':created_on' 	=> date('c'),
			':modified_by' 	=> null,
			':modified_on' 	=> null,

			':session_id' 	=> $session['id'],
			':team_id' 		=> $score['team']['id'],
			':player_id' 	=> $score['player']['id'],
			':score_array' 	=> json_encode($score['score_array']),
			':handicap' 	=> $score['handicap']
		);

		return $this->db->Query($query, $values);
	}


}
