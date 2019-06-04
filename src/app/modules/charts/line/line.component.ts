import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LineSettingsComponent } from '../line-settings/line-settings.component';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
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

  @Input() data;

  availableColors = [
    "#e66969", "#6ab9e8", "#60df60",
    "#d6d05d", "#d8a95d", "#9461e0",
    "#cf58c5"];

  //  holeLabel = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

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
  width = window.innerWidth * .959;
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
      left: "0%", top: "%0", width: '100%', height: '90%',
    },
    theme: "maximized",

    /*  Design  */
    backgroundColor: "transparent",
    colors: this.availableColors,
    pointsVisible: true,
    pointShape: "circle",
    pointSize: 13,
    lineWidth: 2,

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
      textStyle: {
        color: this.fontColor,
      },
      textPosition: "out",
      baselineColor: "#fafaf0",
      gridlines: {
        color: "#506450",
        count: 9,
      }
    },
    vAxis: {
      textStyle: {
        color: this.fontColor,
      },
      textPosition: "in",
      baselineColor: "#fafaf0",
      gridlines: {
        color: "#506450",
        count: 6,
      }
    },

    /*  Doesnt Show  
    trendlines: {
      0: {
        type: 'polynomial',
        degree: 3,
        color: '#FF00FF',
        lineWidth: 7,
        opacity: 1,
        visibleInLegend: true,
        pointSize: 5,
      }
    },
    */


  };
  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    //  Defaults
    this.columnNames = this.data['columns'];
    this.chartData = this.data['scores'];

    //  this.formatChart(this.data['columns'], this.data['scores']);

    this.colList = this.columnNames.filter((v, i) => {
      return i > 0;
    });
    this.initialHeaders = this.columnNames;

    this.initialData = this.chartData;
  }

  actionClick($event) {
    if ($event == "edit") {
      this.openSettings();
    } else if ($event == "rotate") {
      this.rotateChart();
    } 
  }

  /*  Return array(n) colors from bank for data */
  getColorsFromBank() {
    var colors = [];
    //  Grab Team Colors First
    if (this.data["teams"]) {

    } else {
      for (var i = 0; i < this.data["scores"][0].length; i++) {
        colors.push(this.availableColors[i]);
      }
    }
    
    return colors;
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

  filterData($event) {
    //  console.log("Chart: ", this.chart);
    //  console.log ("eventTarget", $event)

    /**
     *  Get Stuff to Save
     */
    var keep = [0];
    //  console.log ("$event.value: ", $event.value);
    $event.value.map((ev, ei) => {
      this.initialHeaders.map((cv, ci) => {
        if (cv == ev) {
          keep.push(ci);
        }
      })
    });
    //  console.log("keep[ci]: ", keep);
    //  console.log("ColumnHeaders: ", this.columnNames);



    /**
     *  Filter Columns
     */
    this.columnNames = this.initialHeaders.filter((hv, hi) => {
      return keep.indexOf(hi) > -1;
    });
    //  console.log("AdjustedColumnHeaders: ", this.columnNames);


    /**
     *  Filter Data
     */
    this.chartData = this.initialData.map((ia, ii) => {
      //  console.log("\n New Itteration: [", ii, "]:", ia);
      ia = ia.filter((v, i) => {
        if (keep.indexOf(i) != -1) {
          return true;
        } else {
          return false;
        }
      });
      //  console.log("postFilter[", ii, "]:", ia);
      return ia;
    });
    //  console.log("Data: ", this.data);
    //  console.log("initialData: ", this.initialData);


    /**
     *  Update Options
    */
    this.options.colors = this.availableColors.filter((cv, ci) => {
      //  +1 due to vAxis Label
      return keep.indexOf(ci + 1) > -1;
    });
  }

  initializeOrientation() {

    if (window.innerWidth < window.innerHeight) {

    } else {

    }
  }

  openSettings() {
    const settingsDialog = this.dialog.open(LineSettingsComponent, {
      data: this.data
    });

    settingsDialog.afterClosed().subscribe((diag) => {
      console.log ("popup.Data: ", diag);

      if (diag) {
        diag[""]


        this.formatChart(diag["data"]);
      }
    });
  }


  formatChart(data) {
    //  set chart columnHeaders, and Data array from import;
    //  Fire upon settingspopup close
    //  settings will handle and return the filtered data into this, to show the data;

    //  Teams y/n?

    if (true) {}


  }


}
