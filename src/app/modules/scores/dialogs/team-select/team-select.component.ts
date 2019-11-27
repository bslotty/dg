import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SessionFormService } from 'src/app/modules/sessions/services/form.service';

@Component({
  selector: 'app-team-select',
  templateUrl: './team-select.component.html',
  styleUrls: ['./team-select.component.scss']
})
export class TeamSelectComponent implements OnInit {

  constructor(
    private sessionsF_: SessionFormService
  ) { }

  ngOnInit() {
  }


  getRoster(team) {
    var roster;
    if (team == null) {
      roster = this.sessionsF_.scoreList.value.filter((s) => { return !s.team });
    } else {
      roster = this.sessionsF_.scoreList.value.filter((s) => {
        if (s.team) {
          return s.team == team.value;
        }

      });
    }
    return roster;
  }

  rosterDrop(event: CdkDragDrop<string[]>) {

    //  Get Destination Color Name
    var teamDestName = event.container.id.toString().replace("team-", "");

    //  Get Team Object From Color Name
    var teamDest = this.sessionsF_.teamList.value.filter((t) => {
      return t.color.name == teamDestName;
    });

    //  Update Player's Team
    this.sessionsF_.scoreList.controls.forEach((s) => {
      if (event.item.data.player.id == s.value.player.id) {
        s.value.team = teamDest[0];
      }
    });
  }


  trackTeamBy(index, item) {
    item.value.id;
  }
}
