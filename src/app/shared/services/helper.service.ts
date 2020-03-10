import { Injectable } from '@angular/core';
import { SessionFormat, Session, Score, Player, Team } from '../types';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  public types:SessionFormat[] = [
    {
      name: 'Free For All',
      enum: 'ffa',
      desc: `Every person for themselves! This is standard play.`,
    }, {
      name: 'Teams: Sum',
      enum: 'team-sum',
      desc: `This format will combine the scores of each player on each team. Rankings will be sorted by the Team's Total Score.`,
    }, {
      name: 'Teams: Average',
      enum: 'team-average',
      desc: `This format will average the throw totals of each player against par. Rankings will be sorted by the Team's Average Score.`,
    }, {
      name: 'Teams: Best Only',
      enum: 'team-best',
      desc: `This format will only count the best score of each hole. Scores are set from the best scores of each hole.`,
    }
  ];

  constructor() { }


  //  Migrate all calls from other services to here
  //  This Service should house all common service functions.

  /**
 * @param ServerPayload res Subscription Response
 * @returns boolean true if the latest query ran by the server was successfull;
 * -- else false
 */
  rCheck(res): boolean {
    if (res != null) {
      var latest = res.length - 1;
      if (res[latest]["status"] == "success") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

  rGetData(res): Array<any> {
    var latest = res.length - 1;
    if (latest > -1) {
      return res[latest]["results"];
    } else {
      return [];
    }
  }



  /*  Server Data Conversions */
  /** Take Format String and Convert to :SessionFormat
 * 
 */

  convertFormatStr(str) {
    return this.types.find(t => t.enum == str);
  }

  convertProperties(res) {
    var result = [];

    this.rGetData(res).forEach((session) => {
      result.push(new Session(
        session['id'],
        session['created_on'],
        session['created_by'],
        session['modified_on'],
        session['modified_by'],
        session['course'],
        this.convertFormatStr(session['format']),
        session['starts_on'],
        session['title'],
        session['par'],
        session['scores'],
      ));
    });

    return result;
  }


  /*
  export class Score {
  public id: string;
  public player: Player;
  public scores: Array<number>;
  public team: Team | null
  public handicap: number;

  constructor() { }
}
*/

  convertSessionScores(scores: Score[]) {
    var result: Score[] = [];

    console.log ("scores:", scores);
    scores.forEach((s) => {
      var score = new Score();
      score.id = s['scores.id'];
      score.created_on = s['scores.created_on'];
      score.created_by = s['scores.created_by'];
      score.modified_on = s['scores.modified_on'];
      score.modified_by = s['scores.modified_by'];
      score.handicap = s['scores.handicap'];
      //score.scores = s['scores.score_array'];

      score.player = new Player(
        s["scores.player.id"],
        s["scores.player.first_name"],
        s["scores.player.last_name"],
        s["scores.player.email"]
      );

      score.team = new Team(
        s["scores.team.id"],
        s["scores.team.name"],
        s["scores.team.color"],
        s["scores.team.hex"],
      );

      result.push(score);
    });


    return result;
  }

}
