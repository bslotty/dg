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
			`s`.`id` AS `scores.id`,
			`s`.`created_by` AS `scores.created_by`, 
			`s`.`created_on` AS `scores.created_on`, 
			`s`.`modified_by` AS `scores.modified_by`, 
			`s`.`modified_on` AS `scores.modified_on`, 
			`s`.`score_array` AS `scores.score_array`, 
			`s`.`handicap` AS `scores.handicap`,

			`p`.`id` AS `player.id`,
			`p`.`first_name` AS `player.first_name`,
			`p`.`last_name` AS `player.last_name`,
			`p`.`email` AS `player.email`

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
			`s`.`id` AS `scores.id`,
			`s`.`created_by` AS `scores.created_by`, 
			`s`.`created_on` AS `scores.created_on`, 
			`s`.`modified_by` AS `scores.modified_by`, 
			`s`.`modified_on` AS `scores.modified_on`, 
			`s`.`score_array` AS `scores.score_array`, 
			`s`.`handicap` AS `scores.handicap`,

			`t`.`id` AS `team.id`,
			`t`.`name` AS `team.name`,
			`t`.`color` AS `team.color`,

			`p`.`id` AS `player.id`,
			`p`.`first_name` AS `player.first_name`,
			`p`.`last_name` AS `player.last_name`,
			`p`.`email` AS `player.email`

		FROM `Scores` AS `s`
		JOIN `Teams` AS `t` 	ON `s`.`team_id` 	= `t`.`id`
		JOIN `Players` AS `p` 	ON `s`.`player_id` 	= `p`.`id`
		WHERE `s`.`session_id` = :id;";

		$values = array(
			':id' => $session['id']
		);

		return $this->db->Query($query, $values);
	}


	public function setHandicap($score)
	{
		$query = "SELECT 
		`s`.`id` AS `scores.id`, 
		`s`.`handicap` AS `scores.handicap`, 

		`t`.`id` AS `team.id`,
		`t`.`name` AS `team.name`,
		`t`.`color` AS `team.color`,

		`p`.`id` AS `player.id`,
		`p`.`first_name` AS `player.first_name`,
		`p`.`last_name` AS `player.last_name`,
		`p`.`email` AS `player.email`

	FROM `Scores` AS `s`
	JOIN `Teams` AS `t` 	ON `s`.`team_id` 	= `t`.`id`
	JOIN `Players` AS `p` 	ON `s`.`player_id` 	= `p`.`id`
	WHERE `s`.`session_id` = :id;";

		$values = array(
			':id' => $score['id']
		);

		return $this->db->Query($query, $values);
	}


	public function RecientlyPlayedWith($user)
	{
		$query = "SELECT
			`sc`.`id` AS `scores.id`, 
			`sc`.`created_by` AS `scores.created_by`, 
			`sc`.`created_on` AS `scores.created_on`, 
			`sc`.`modified_by` AS `scores.modified_by`, 
			`sc`.`modified_on` AS `scores.modified_on`, 

			`p`.`id` AS 'player.id', 
			`p`.`created_by` AS 'player.created_by', 
			`p`.`created_on` AS 'player.created_on', 
			`p`.`modified_by` AS 'player.modified_by', 
			`p`.`modified_on` AS 'player.modified_on', 
			`p`.`first_name` AS 'player.first_name',
			`p`.`last_name` AS 'player.last_name',
			`p`.`email` AS 'player.email',

			`sc`.`score_array` AS `scores.score_array`, 
			`sc`.`handicap` AS `scores.handicap`
		FROM `Scores` AS `sc`
		JOIN `Sessions` AS `sn`
		JOIN `Players` AS `p`
		
		WHERE 
			`sn`.`id` = `sc`.`session_id` AND
			`sc`.`player_id` = :userId
		GROUP BY	`p`.`id`
		ORDER BY `sn`.`created_on` DESC;";

		$values = array(
			':userId' => $user["id"]
		);

		return $this->db->Query($query, $values);
	}
}
