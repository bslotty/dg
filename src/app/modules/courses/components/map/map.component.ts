import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Course } from '../../services/backend.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() course: Course;
  @Input() search: boolean = true; 

  @Output() selectedLocation: EventEmitter<Course | Boolean> = new EventEmitter();

  latitude: number = 42.8990;
  longitude: number = -87.8986;
  zoom: number = 7;
  address: string;
  private geoCoder;

  @ViewChild('search', {static: false})
  public searchElementRef: ElementRef;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }


  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["establishment"]
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 15;

          this.getAddress(this.latitude, this.longitude);
          
        });
      });
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      //  console.log(status);
      if (status === 'OK') {
        var park = this.validPark(results);
        if (park != false) {
          this.address = park.formatted_address;
          this.getFormattedAddress(park);
        } else {
          this.selectedLocation.next(false);
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  /**
   * @param results Google Places result array
   * @return result containing the park entry
   */
  validPark(results) {
    for (let i in results) {
      for (let p in results[i].address_components){
        var item = results[i].address_components[p]
        if (item.types.indexOf("park") > -1) {
          //  console.log ("foundParkAt: ", i);
          return results[i];
        }
      }
    }
    return false;
  }

  getFormattedAddress(place) {
    //@params: place - Google Autocomplete place object
    //@returns: location_obj - An address object in human readable format
    let location_obj = {};
    for (let i in place.address_components) {
      let item = place.address_components[i];
      
      location_obj['formatted_address'] = place.formatted_address;
      if(item['types'].indexOf("locality") > -1) {
        location_obj['locality'] = item['long_name']

      } else if (item['types'].indexOf("administrative_area_level_1") > -1) {
        location_obj['admin_area_l1'] = item['short_name']

      } else if (item['types'].indexOf("postal_code") > -1) {
        location_obj['postal_code'] = item['short_name']

      } else if (item["types"].indexOf('park') > -1) {
        location_obj['park'] = item['long_name']
      }
     
      //  console.log ("location_obj: ", location_obj);
    }

    //  Only Addresses with parks are allowed;
    if (!location_obj['park']) {
      this.selectedLocation.next(false);
    } else {
      var course = new Course();
      course.parkName   = location_obj['park'];
      course.city       = location_obj['locality'];
      course.state      = location_obj['admin_area_l1']
      course.zip        = location_obj['postal_code']
      course.lat        = this.latitude;
      course.lng        = this.longitude;

      //  console.log ("newCourse: ", course)

      this.selectedLocation.next(course);
    }

    return location_obj;
  }

  pin(event, place){
    console.log ("Map Click: ", event, place);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
}
