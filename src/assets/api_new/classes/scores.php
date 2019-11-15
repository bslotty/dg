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
			':team_id' 		=> $score["team"]['id'],
			':player_id' 	=> $score['player']['id'],
			':score_array' 	=> json_encode($score['score_array']),
			':handicap' 	=> $score['handicap']
		);

		return $this->db->Query($query, $values);
	}


	//	Need to verify that the record will still be pulled if the team is null or not found;
	//			May need to write another function for Scores with Teams, and change the logic on the controller;
	public function getScores($session)
	{
		$query = "SELECT 
			`s`.`id`,
			`s`.`created_by`, 
			`s`.`created_on`, 
			`s`.`modified_by`, 
			`s`.`modified_on`, 
			`s`.`score_array`, 
			`s`.`handicap`,

			`p`.`id` AS `playerID`,
			`p`.`first_name` AS `playerFirst`,
			`p`.`last_name` AS `playerLast`,
			`p`.`email` AS `playerEmail`

		FROM `Scores` AS `s`
		JOIN `Players` AS `p`
		WHERE 	`s`.`session_id` 	= :id 		AND 
				`s`.`player_id` 	= `p`.`id`";

		$values = array(
			':id' => $session['id']
		);

		return $this->db->Query($query, $values);
	}

	public function getScoresWithTeams($session)
	{
		$query = "SELECT 
			`s`.`id`,
			`s`.`created_by`, 
			`s`.`created_on`, 
			`s`.`modified_by`, 
			`s`.`modified_on`, 
			`s`.`score_array`, 
			`s`.`handicap`,

			`t`.`id` AS `teamID`,
			`t`.`name` AS `teamName`,
			`t`.`color` AS `teamColor`,

			`p`.`id` AS `playerID`,
			`p`.`first_name` AS `playerFirst`,
			`p`.`last_name` AS `playerLast`,
			`p`.`email` AS `playerEmail`

		FROM `Scores` AS `s`
		JOIN `Teams` AS `t`
		JOIN `Players` AS `p`
		WHERE 	`s`.`session_id` 	= :id 		AND 
				`s`.`team_id` 		= `t`.`id` 	AND 
				`s`.`player_id` 	= `p`.`id`";

		$values = array(
			':id' => $session['id']
		);

		return $this->db->Query($query, $values);
	}
}
