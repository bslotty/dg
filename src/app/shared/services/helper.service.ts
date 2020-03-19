import { Injectable } from '@angular/core';
import { SessionFormat, Session, Score, Player, Team, Course, ServerPayload } from '../types';


import { of } from 'rxjs/internal/observable/of';

import { pipe } from 'rxjs/internal/util/pipe';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { catchError } from 'rxjs/internal/operators/catchError';
import { FeedbackService } from '../modules/feedback/services/feedback.service';
import { retryWhen } from 'rxjs/internal/operators/retryWhen';
import { delay } from 'rxjs/internal/operators/delay';
import { take } from 'rxjs/internal/operators/take';
import { timeout } from 'rxjs/internal/operators/timeout';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  public pipe = pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );


  public types: SessionFormat[] = [
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

  constructor(
    private feed: FeedbackService,
  ) { }


  //  Migrate all calls from other services to here
  //  This Service should house all common service functions.

  /**
 * @param res:ServerPayload[]
 * @returns boolean true if the latest query ran by the server was successfull;
 * -- else false
 */
  rCheck(res /*: ServerPayload[]*/): boolean {
    if (res != null) {
      var latest = res.length - 1;
      if (res[latest]["status"] == "success") {
        return true;
      } else {

        console.warn("server.error: ", res[latest]["status"]["message"] );
        return false;
      }
    } else {

      console.warn("server.error.nothing: ", res[latest]["status"]["message"] );
      return false;
    }

  }

  /**
 * @param ServerPayload[]
 * @returns Data Array
 * -- else []
 */
  rGetData(res/*: ServerPayload[]*/): Array<any> {

    console.log ("rGetData: ", res);
    var latest = res.length - 1;
    if (latest > -1) {
      return res[latest]["formattedResults"];
    } else {
      return [];
    }
  }



  /*  Server Data Conversions */
  /** Take Format String and Convert to :SessionFormat
 * 
 */

  convertFormatStr(str): SessionFormat {
    return this.types.find(t => t.enum == str);
  }

  convertSession(res) {
    var result = [];

    if (this.rCheck(res)) {
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
    }

    console.log("ConvertSession: ", result);

    this.feed.loading = false;
    return result;
  }



  convertScores(res: ServerPayload[]): Score[] {
    var result: Score[] = [];

    if (this.rCheck(res)) {
      this.rGetData(res).forEach((s) => {
        var score = new Score();
        score.id = s['scores.id'];
        score.created_on = s['scores.created_on'];
        score.created_by = s['scores.created_by'];
        score.modified_on = s['scores.modified_on'];
        score.modified_by = s['scores.modified_by'];
        score.handicap = s['scores.handicap'];
        score.scores = s['scores.score_array'];

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
    }



    return result;
  }



  convertCourse(courses): Course[] {
    var result: Course[] = [];

    courses.forEach((course) => {
      result.push(new Course(
        course['id'],
        course['created_on'],
        course['created_by'],
        course['modified_on'],
        course['modified_by'],
        course['park_name'],
        course['city'],
        course['state'],
        course['zip'],
        +course['latitude'],
        +course['longitude'],
      ));
    });

    return result;
  }

}
