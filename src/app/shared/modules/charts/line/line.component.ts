import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LineSettingsComponent } from '../line-settings/line-settings.component';
import { StatsBackend } from '../../../../modules/stats/services/backend.service';
import { flyInPanelRow } from 'src/app/animations';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
  animations: [flyInPanelRow]
})
export class LineComponent implements OnInit {

  headerButtons = [
    {
      action: "edit",
      icon: "icon-settings",
      color: "transparent-primary"
    }, {
      action: "rotate",
      icon: "icon-rotate-cw",
      color: "transparent-primary"
    }
  ];
  resolve: boolean = false;

  @Input() data;
  @Input() format;
  @Input() par;
  @Input() teams;
  @Input() players;

  fontColor = "#EFEFEF";


  //  Data
  columnNames = [];
  chartData = [];

  initialHeaders = [];
  initialData = [];
  colList = [];


  //  Chart Options
  title = "";
  type = "LineChart";
  width = document.getElementsByClassName("headerContainer")[0].scrollWidth; //window.innerWidth * .959;
  height = 400;
  orientation = "horizontal";


  options = {

    /*  Axis jumps to another bar; looks inconsistant */
    animation: {
      duration: 0,
      easing: "linear",
      startup: false,
    },

    /*  Structure  */
    curveType: "function",
    enableInteractivity: true,
    dynamicResize: true,
    chartArea: {
      left: "5%", top: "%0", width: '90%', height: '90%',
    },
    theme: "maximized",

    /*  Design  */
    backgroundColor: "transparent",
    colors: [],
    pointsVisible: true,
    pointShape: "circle",
    pointSize: 10,
    lineWidth: 3,

    series: {
      0: {},
    },

    /*  Section Specific  */
    legend: {
      alignment: "center",
      position: "top",
      textStyle: {
        color: this.fontColor,
      }
    },
    hAxis: {
      /*  title: "Hole",  */
      textStyle: {
        color: this.fontColor,
      },
      textPosition: "out",
      baseline: 9,
      baselineColor: "#fafaf0",
      gridlines: {
        color: "#506450",
        count: -1,
      }
    },
    vAxis: {
      /*  title: "Score", */
      ticks: [],
      textStyle: {
        color: this.fontColor,
      },
      textPosition: "out",
      baseline: 0,
      baselineColor: "#fafaf0",
      gridlines: {
        color: "#506450",
        count: -1,
      },
      maxValue: 10,
      minValue: -10
    },

  };
  constructor(
    private dialog: MatDialog,
    private stats: StatsBackend,
  ) { }

  ngOnInit() {
    //  Defaults
    this.columnNames = this.data['columns'];
    this.chartData = this.data['scores'];
    this.options.colors = this.stats.getColorsFromBank(this.players, this.teams);

    //  this.formatChart(this.data['columns'], this.data['scores']);

    this.initialHeaders = this.columnNames;
    this.initialData = this.chartData;

    console.log("chart: ", this.chartData);

    //  Set Tick Range;
    this.options.vAxis.maxValue = this.getHighestScore();
    this.options.vAxis.minValue = this.getLowestScore();



    this.options.vAxis.ticks = this.initTicks();



    this.resolve = true;
  }

  actionClick($event) {
    if ($event == "edit") {
      this.openSettings();
    } else if ($event == "rotate") {
      this.rotateChart();
    }
  }

  getLowestScore() {
    var score = 0

    this.chartData.map((scores, i) => {
      var testScore = scores.sort((a, b) => {
        if (typeof a === "string") {
          return null;
        } else if (typeof b == "string") {
          return null
        }
        return a - b;
      })[1]; // Return 1, as 0 is the hole string;

      if (testScore < score) {
        score = testScore;
      }
    });

    return score;
  }

  getHighestScore() {
    var score = 0

    this.chartData.map((scores, i) => {
      var testScore = scores.sort((a, b) => {
        if (typeof a === "string") {
          return null;
        } else if (typeof b == "string") {
          return null
        }
        return b - a;
      })[1]; // Return 1, as 0 is the hole string;

      if (testScore > score) {
        score = testScore;
      }
    });

    return score;
  }

  initTicks(): Array<any> {

    var ticks = [];
    for (var i = this.getLowestScore(); i <= this.getHighestScore(); i++) {
      if (i == this.options.vAxis.minValue) {
        var remainder = 3 - Math.abs(this.options.vAxis.minValue % 3);
        var paddingValue = this.options.vAxis.minValue - remainder;
        ticks.push(paddingValue);
      } else if (i == this.options.vAxis.maxValue) {
        var remainder = 3 - Math.abs(this.options.vAxis.maxValue % 3);
        var paddingValue = remainder + this.options.vAxis.maxValue;
        ticks.push(paddingValue);
      } else if (i % 3 == 0) {
        ticks.push(i);
      }
    }

    console.log("Ticks: ", ticks);
    return ticks;
  }



  /*  Change orientation onClick */
  rotateChart() {
    if (this.orientation == "horizontal") {
      this.height = window.innerWidth * .959;
      this.width = window.innerHeight * .8;
      this.orientation = "vertical";
    } else {
      this.width = window.innerWidth * .959;
      this.height = 400;
      this.orientation = "horizontal";
    }
  }

  filterData(selectedColumns) {

    /** Get Stuff to Save
     */
    var keep = [0];
    selectedColumns.map((ev, ei) => {
      this.initialHeaders.map((cv, ci) => {
        if (cv == ev) {
          keep.push(ci);
        }
      })
    });

    /** Filter Columns
     */
    this.columnNames = this.initialHeaders.filter((hv, hi) => {
      return keep.indexOf(hi) > -1;
    });


    /** Filter Data
     */
    this.chartData = this.initialData.map((ia, ii) => {
      ia = ia.filter((v, i) => {
        if (keep.indexOf(i) != -1) {
          return true;
        } else {
          return false;
        }
      });
      return ia;
    });
  }

  openSettings() {
    const settingsDialog = this.dialog.open(LineSettingsComponent, {
      data: {
        scores: this.data,
        format: this.format,
        colors: this.stats.getColorsFromBank(this.players, this.teams),
        teams: this.teams,
        players: this.players,
      }
    });

    settingsDialog.afterClosed().subscribe((diag) => {
      //  console.log ("popup.Data: ", diag);

      if (diag) {

        //  Re-Format Data From Arrays;
        //  Get Teams for Repop
        var teams = this.teams.filter((t) => {
          return diag['selectedColumns'].indexOf(t.name) > -1;
        });

        //  Get Players for Repop
        var players = this.players.filter((p) => {

          //  Shorten Name;
          var name = p.user.first + " " + p.user.last.substr(0, 3);
          return diag['selectedColumns'].indexOf(name) > -1;
        });


        //  Exception to Show Team Only
        if (players.length == 0 && teams.length > 0) {
          players = this.players;
        }
        //  Rework Above player reset to account for Partial Team Selection
        //  Team 1 No players with team 2 any players gets around the above filter and Errors
        //    Need to count for players on teams, if teams exist
        //      If Teams -> Loop ->
        //        Roster Player Count vs Selected Player Count for this team
        //        If Blank-> Assign full team roster temporarily
        //
        //        Then we need to account for visibility. Which will not be accounted for 
        //        if we replace the player array with the initial array...
        //
        //        Worth?


        //  Add a sub-display to the title to show Scores/Throws

        this.options.colors = this.stats.getColorsFromBank(players, teams);

        //  Data Store
        players = this.stats.populatePlayerScores(players, this.par);
        teams = this.stats.populateTeamScores(teams, players, this.par);

        //  console.log ("AfterCheck: players: ", players, "teams: ", teams, "colors: ", this.options.colors);

        //  Format Chart Data;
        var results = this.stats.formatChart(players, diag["teamFormat"], diag["format"], teams);

        this.chartData = results['scores'];
        this.columnNames = results["columns"];

        //  Toggles Visibility
        //  this.filterData(diag['selectedColumns']);

        //  console.log ("results: ", results, this.chartData);
      }
    });
  }



}


export interface Chart {
  columns: Array<any>;
  scores: Array<any>;
}