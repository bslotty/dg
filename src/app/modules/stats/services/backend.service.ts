import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerPayload } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { Session } from '../../sessions/services/backend.service';
import { User, AccountBackend } from '../../account/services/backend.service';
import { map, catchError } from 'rxjs/operators';
import { of, Subject, Observable, BehaviorSubject } from 'rxjs';
import { League } from 'src/app/modules/leagues/services/backend.service';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class StatsBackend {

  list$: BehaviorSubject<Stats[]> = new BehaviorSubject([]);
  update$: Subject<Boolean> = new Subject();

  constructor(
    private http: HttpClient,
    private account: AccountBackend,
  ) { }

  viewPlayers() {
    return this.list$.asObservable();
  }


  getList(session: Session) {
    let url = environment.apiUrl + "/stats/list.php";
    return this.http.post(url, { "session": session }).pipe(
      map((res: ServerPayload) => {

        if (res.status == "success") {
          var result = [];

          res.data.forEach((stats) => {

            var scores = JSON.parse(stats["throws"]);

            result.push(new Stats(
              stats["id"],
              new User(
                stats["user"]["id"],
                stats["user"]["first"],
                stats["user"]["last"],
              ),
              new Team(
                stats["team"]['id'],
                stats["team"]['name'],
                stats["team"]['color']
              ),
              scores,
              null,
              null,
            ));
          });

          this.list$.next(result);
          return result;
        } else {
          this.list$.next([]);
          return result;
        }
      })
    )
  }

  createPlayer(
    league: League,
    session: Session,
    player,
    team,
  ) {
    let url = environment.apiUrl + "/stats/create.php";
    return this.http.post(url,
      {
        "league": league,
        "session": session,
        "player": player,
        "team": team,
        "user": this.account.user
      }
    );
  }

  updateStats(
    league: League,
    session: Session,
    roster: any
  ) {
    let url = environment.apiUrl + "/stats/edit.php";
    return this.http.post(url,
      {
        "league": league,
        "session": session,
        "roster": roster,
        "user": this.account.user
      }
    );
  }

  removePlayer(
    league: League,
    session: Session,
    player,
  ) {
    let url = environment.apiUrl + "/stats/remove.php";
    return this.http.post(url,
      {
        "league": league,
        "session": session,
        "player": player,
        "user": this.account.user
      }
    );
  }


  updatePar(
    league: League,
    session: Session,
    par: any
  ) {
    let url = environment.apiUrl + "/stats/setPar.php";
    return this.http.post(url,
      {
        "league": league,
        "session": session,
        "par": par,
        "user": this.account.user
      }
    );
  }


  merge(league, session, player, temp) {
    let url = environment.apiUrl + "/stats/merge.php";
    return this.http.post(url,
      {
        "league": league,
        "session": session,
        "user": this.account.user,
        "player": player,
        "temp": temp,
      }
    );
  }

  createTempPlayer(league, session, player) {
    let url = environment.apiUrl + "/stats/createTempPlayer.php";
    return this.http.post(url,
      {
        "league": league,
        "session": session,
        "user": this.account.user,
        "tempPlayer": player,
      }
    );
  }


  getTeams(session: Session) {
    let url = environment.apiUrl + "/teams/list.php";
    return this.http.post(url, { "session": session }).pipe(
      map((res: ServerPayload) => {

        if (res.status == "success") {
          var result: Team[] = [];

          res.data.forEach((team) => {

            result.push(new Team(
              team["id"],
              team["name"],
              team["color"],
              this.getHex(team["color"]),
            ));
          });

          this.list$.next(result);
          return result;
        } else {
          this.list$.next([]);
          return result;
        }
      })
    )
  }

  createTeam(leauge, session, team) {
    let url = environment.apiUrl + "/teams/create.php";
    return this.http.post(url,
      {
        "session": session,
        "league": leauge,
        "user": this.account.user,
        "team": team,
      }
    );
  }

  updateTeam(leauge, session, team) {
    let url = environment.apiUrl + "/teams/update.php";
    return this.http.post(url,
      {
        "session": session,
        "league": leauge,
        "user": this.account.user,
        "team": team,
      }
    );
  }

  deleteTeam(leauge, session, team) {
    let url = environment.apiUrl + "/teams/delete.php";
    return this.http.post(url,
      {
        "session": session,
        "league": leauge,
        "user": this.account.user,
        "team": team,
      }
    );
  }


  populateTeamScores(teams, players, session) {
    //  Calculate Score
    teams.filter((team) => {
      var scores = [];

      players.filter((player) => {
        player['throws'].filter((attempt, index) => {

          // Setup Array
          if (!isArray(scores[index])) {
            scores[index] = [];
          }


          //  Push Team Scores
          if (player.team.id == team.id) {
            scores[index].push(attempt - session.par[index]);
          }
        });
      });

      var formats = ["team-sum", "team-average", "team-best"];
      team['teamScore'] = [];
      formats.map((v, i) => {

        var teamScore = 0;
        team['teamScore'][v] = {
          scoreArray: [],
          throwArray: [],
        };
        scores.filter((hole) => {

          switch (v) {
            case "team-sum":
              //  Reduce to sum score array
              var total = hole.reduce((total, item) => { return total + item });
              teamScore = teamScore + total;

              team['teamScore'][v]["scoreArray"].push(teamScore);
              team['teamScore'][v]["throwArray"].push(total);
              break;

            case "team-average":
              var total = hole.reduce((total, item) => { return total + item });
              var avg = Math.round((total / hole.length) * 10) / 10;
              teamScore = teamScore + avg;

              team['teamScore'][v]["scoreArray"].push(teamScore);
              team['teamScore'][v]["throwArray"].push(avg);
              break;

            case "team-best":
              //  Sort score array low-high and only add lowest
              hole.sort((a, b) => { return a - b });
              teamScore = teamScore + hole[0];

              team['teamScore'][v]["scoreArray"].push(teamScore);
              team['teamScore'][v]["throwArray"].push(hole[0]);
              break;
          }


        });

        team['scores'] = scores;
        team['teamScore'][v]["final"] = teamScore;

        /*
        //  Sort by Score
        teams = teams.sort((a, b) => {
          return a['teamScore'][v] - b['teamScore'][v];
        });
        */
      });
    });

    console.log("populateTeamScores.teams: ", teams);

    return teams;
  }

  populatePlayerScores(players, session) {

    //  Calculate Score
    players.filter((player) => {
      var score = 0;
      var scoreArray = [];
      var throwArray = []

      player['throws'].filter((attempt, index) => {
        var t = (attempt - session.par[index]);
        score = score + t;
        throwArray.push(t);
        scoreArray.push(score);
      });

      player['score'] = score;
      player['throwArray'] = throwArray;
      player['scoreArray'] = scoreArray;
    });


    //  Sort by Score
    players = players.sort((a, b) => {
      return a['score'] - b['score'];
    });


    //  Spread
    players.filter((player, i) => {
      if (i == 0) {
        player['spread'] = "0";
      } else {
        player['spread'] = player['score'] - players[i - 1]['score'];

        //  Possible Tied Message here?
      }
    });

    console.log("populatePlayerScores.player: ", players);

    return players;
  }



  /**
   *  Return: ['ColName', prop, prop, prop, ...]
   * 
   * @param teams 
   * @param players 
   * @param session 
   */
  formatChart(teams, players, session): Object {
    var columns = ["Hole"];
    var data = [];
    var par = session.par;

    //  Format Player Data
    players = this.populatePlayerScores(players, session);

    //  Populate Names
    players.map((v, i) => {
      var name = v["user"]["first"] + " " + v["user"]["last"].substr(0, 3);

      //  Column Names
      columns.push(name);

      //  Hole Count Data Setup
      v["scoreArray"].map((s, i) => {
        if (data[i] == undefined) {
          data[i] = [];
        }
      });

      //  Scores
      for (var h = 0; h < v["scoreArray"].length; h++) {

        //  Initiate Array with hole Count
        if (data[h].length == 0) {
          data[h][0] = (h + 1) + "";
        }

        //  Enter Player scores Data;
        data[h].push(v["scoreArray"][h]);
      }
    });




    //  Format Team Data
    if (session.format != "ffa") {
      teams = this.populateTeamScores(teams, players, session);
      teams.map((v, i) => {
        //  Column Names
        columns.push(v.name);

        //  Hole Count Data Setup
        v["teamScore"][session.format]["scoreArray"].map((s, i) => {
          if (data[i] == undefined) {
            data[i] = [];
          }
        });

        //  Scores
        for (var h = 0; h < v["teamScore"][session.format]["scoreArray"].length; h++) {

          //  Initiate Array with hole Count
          if (data[h].length == 0) {
            data[h][0] = (h + 1) + "";
          }

          //  Enter Player scores Data;
          data[h].push(v["teamScore"][session.format]["scoreArray"][h]);
        }

      });
    }


    return {
      columns: columns,
      scores: data,
      teams: teams,
      players: players,
      par: session.par
    };
  }


  /*  Return Color Codes from String for Chart Color Consistancy  */
  getHex(color) {
    var hex;
    switch (color) {
      case "red":
        hex = "#e66969";
        break;

      case "blue":
        hex = "#6ab9e8";
        break;

      case "green":
        hex = "#60df60";
        break;

      case "yellow":
        hex = "#d6d05d";
        break;

      case "orange":
        hex = "#d8a95d";
        break;

      case "purple":
        hex = "#9461e0";
        break;

      case "pink":
        hex = "#cf58c5";
        break;

      case "white":
        hex = "#FFFFFF";
        break;

      default:
        hex = "#000000"
        break;
    }

    return hex;
  }
}


export class Stats {
  constructor(
    public id: string,
    public user?: User,
    public team?: Team,
    public throws?: Array<any>,
    public score?: number,
    public spread?: string,
  ) { }
}


export class Team {
  constructor(
    public id: string,
    public name?: string,
    public color?: string,
    public hex?: string,
  ) { }
}


