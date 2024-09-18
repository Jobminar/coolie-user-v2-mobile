import { Injectable, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl'
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  private currentLocationSubject = new BehaviorSubject<[number, number] | null>(null);
  currentLocation$ = this.currentLocationSubject.asObservable();
  locationFromComponent:any;
  providerMarker: mapboxgl.Marker | undefined;
  userMarker: mapboxgl.Marker | undefined;
  private map: mapboxgl.Map | undefined;
  currentLocation: any ;
  providerLocation: any = [];
  watchId: number | undefined;

  constructor() {
    mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGllbm8xLWFkbWluIiwiYSI6ImNsdWZjZGR1ZzBtZHcybnJvaHBiYTd2NzMifQ.TQ6FrqUIUUWv7J7n75A3tQ";
  }

  initializeMap(container: string, style: string = 'mapbox://styles/mapbox/streets-v11') {
    navigator.geolocation.getCurrentPosition(position => {
      this.currentLocation = [position.coords.longitude, position.coords.latitude];
      console.log(this.currentLocation);
      this.currentLocationSubject.next([position.coords.longitude, position.coords.latitude]);
      this.map = new mapboxgl.Map({
        container: container,
        style: style,
        zoom: 12,
        center: this.currentLocation
      });

      this.userMarker = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(this.currentLocation)
        .addTo(this.map);

      this.watchId = navigator.geolocation.watchPosition(position => {
        const watchedLocation: [number, number] = [position.coords.longitude, position.coords.latitude];
        if (this.providerMarker) {
          this.providerMarker.setLngLat(watchedLocation);
        }
      }, error => {
        console.error('Error watching position:', error);
      });
    });
  }

  getProviderLocation() {
    this.providerLocation = [];
  }

  getPlaceNameFromCoordinates(coordinates: [number, number]): Observable<string> {
    console.log(this.currentLocation);
    const accessToken = "pk.eyJ1IjoiY29vbGllbm8xLWFkbWluIiwiYSI6ImNsdWZjZGR1ZzBtZHcybnJvaHBiYTd2NzMifQ.TQ6FrqUIUUWv7J7n75A3tQ";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.currentLocation[0]},${this.currentLocation[1]}.json?access_token=${accessToken}`;

    return new Observable(observer => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('API Response:', data); // Log entire response
          if (data.features.length === 0) {
            throw new Error('No results found');
          }
          const placeName = data.features;
          observer.next(placeName);
          observer.complete();
        })
        .catch(error => {
          console.error('Error fetching place name:', error);
          observer.error(error);
        });
    });
  }}
