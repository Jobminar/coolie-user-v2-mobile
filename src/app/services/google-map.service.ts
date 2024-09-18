import { Injectable } from '@angular/core';
import { GoogleMap,MapMarker } from '@angular/google-maps';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetailsService } from './user-details.service';


@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  private map: google.maps.Map | null = null;
  private directionsService = new google.maps.DirectionsService();
  private directionsRenderer = new google.maps.DirectionsRenderer();
  
  currentLocation$ = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);

  constructor() { }

  initializeMap(mapElement: HTMLElement): void {
    this.map = new google.maps.Map(mapElement, {
      center: { lat: 0, lng: 0 },
      zoom: 12
    });
    this.directionsRenderer.setMap(this.map);
  }

  getCurrentLocation():Observable<google.maps.LatLngLiteral | null> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        this.currentLocation$.next(location); //emiting the next location
        this.addMarker(location, 'blue-dot');
      }, (error) => {
        console.error('Error getting location', error);
      });
    }

    return this.currentLocation$.asObservable();
  }

  // getting place name by using coordinates and send returning the promise of string type containing the place name
  getPlaceName(latLng: google.maps.LatLngLiteral):Observable<any> {
    const geocoder = new google.maps.Geocoder();
    return new Observable((observable) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          // console.log(results);
          console.log(results);
        
         observable.next(results[1]);  // Return the place name
        } else {
          observable.error('Geocoder failed due to: ' + status);
        }
      });
    });
  }


  addMarker(position: google.maps.LatLngLiteral, icon: string): void {
    if (this.map) {
      new google.maps.Marker({
        position,
        map: this.map,
        icon: `http://maps.google.com/mapfiles/ms/icons/${icon}.png`
      });
    }
  }

  addDestinationMarker(position: google.maps.LatLngLiteral): void {
    this.addMarker(position, 'red-dot');
    this.calculateAndDisplayRoute(this.currentLocation$.getValue(), position);
  }

  calculateAndDisplayRoute(start: google.maps.LatLngLiteral | null, end: google.maps.LatLngLiteral): void {
    if (start && this.map) {
      this.directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === 'OK' && response) {
          this.directionsRenderer.setDirections(response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
    }
  }

  // setting the pincode and dist
 
}
