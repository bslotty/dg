import { flyInPanelRow } from './../../../../animations';
import { PermissionBackend, Permission } from './../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { Location } from "@angular/common";
import { League } from '../../../leagues/services/backend.service';
import { MatDialog } from '@angular/material';
import { PendingComponent } from '../pending/pending.component';
import { RemoveComponent } from '../remove/remove.component';
import { EditComponent } from '../edit/edit.component';
import { AccountBackend } from 'src/app/modules/account/services/backend.service';
@Component({
  selector: 'app-perm-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [flyInPanelRow]
})
export class ListComponent implements OnInit {

  league: League = new League(this.route.snapshot.paramMap.get("league"));
  admin: Boolean = false;

  permissionList$: Permission[];
  recruitList: Permission[];
  recruitCount: number = 0;

  resolve: boolean = false;

  headerButtons = []

  constructor(
    public route: ActivatedRoute,
    public permissions: PermissionBackend,
    public location: Location,
    public dialog: MatDialog,
    public account: AccountBackend,
  ) { }

  ngOnInit() {
    this.populateData();
  }

  actionClick($event) {
    if ($event == "create") {
      this.viewPending();
    }
  }

  populateData() {
    this.permissions.memberList(this.league).subscribe((members) => {

      //  Members
      this.permissionList$ = members.filter((member) => {
        return member['status'] == 'approved'
      });

      //  Recruits
      this.recruitList = members.filter((member) => {
        return member['status'] == "pending";
      });

      this.recruitCount = this.recruitList.length;
      if (this.recruitCount > 0) {
        this.headerButtons.push({
          action: "create",
          icon: "icon-plus",
          color: "transparent-primary"
        });
      }


      //  Admin Check
      members.filter((member) => {
        if (this.account.user.id == member.user.id) {
          if (
            member.level == "creator" ||
            member.level == "moderator"
          ) {
            this.admin = true;
          }
        }
      });

      this.resolve = true;
    });
  }


  viewPending() {
    if (this.recruitCount > 0) {
      const pendingDiag = this.dialog.open(PendingComponent, {
        data: {
          league: this.league,
          recruits: this.recruitList
        }
      });

      pendingDiag.afterClosed().subscribe((diag) => {
        if (diag) {
          this.populateData();
        }

      });
    }
  }

  editMember(permission) {
    this.dialog.open(EditComponent, {
      data: { league: this.league, permission: permission }
    });
  }

  removeMember(permission) {
    this.dialog.open(RemoveComponent, {
      data: { league: this.league, permission: permission }
    });
  }

}
