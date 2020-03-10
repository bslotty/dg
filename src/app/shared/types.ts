export class SessionFormat {
	name: string;
	enum: string;
	desc: string;
}


export class Session {
	constructor(
		public id?: string,
		public created_on?: Date,
		public created_by?: string, /* User? */
		public modified_on?: Date,
		public modified_by?: string, /* User? */
		public course?: Course,
		public format?: SessionFormat,
		public starts_on?: Date,
		public title?: string,
		public par?: Array<any>,
		public scores?: Score[],
	) { }
}





export class Score {
	public id: string;
	public created_on: Date;
	public created_by: string; /* User? */
	public modified_on: Date;
	public modified_by: string; /* User? */
	public player: Player;
	public scores: Array<number>;
	public team: Team | null
	public handicap: number;

	constructor() { }
}

export class Team {
	constructor(
		public id: string,
		public name?: string,
		public color?: TeamColor,
		public hex?: string,
	) { }
}

export class TeamColor {
	constructor(
		public name?: string,
		public hex?: string,
		public available?: boolean
	) { }
}








/**
 *  Classes used within this service 
 */
export class User {

	//  Flag for League Moderation
	public access = {};
	public token;

	constructor(
		public id,
		public first?,
		public last?,
		public email?,
		public pass?,
	) { }
}

export class Password {
	public old;
	public confirm;
	public current;

	constructor() { }
}




/**
 *  Player
 */
export class Player {
	created_by;
	created_on;
	modified_by;
	modified_on;
	token;
	token_expires_on;
	last_logon;

	access = {}

	constructor(
		public id,
		public first_name?,
		public last_name?,
		public email?,
		public password?,
	) { }
}








export class Course {
	constructor(
		public id?: string,
		public created_on?: string,
		public created_by?: string, /* User? */
		public modified_on?: string,
		public modified_by?: string, /* User? */
		public park_name?: string,
		public city?: string,
		public state?: string,
		public zip?: string,
		public latitude?: number,
		public longitude?: number,
	) { }
}