import { Component } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser, Location } from '@angular/common';
import { DemoService } from '../services/demo.service';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css',
})
export class MapsComponent {
  loading: boolean = false;
  destinationInput: string = '';
  suggestions: any[] = [];
  map: mapboxgl.Map | undefined;
  userMarker: mapboxgl.Marker | undefined;
  destinationMarker: mapboxgl.Marker | undefined;
  private currentLocation: [number, number] = [0, 0];
  private watchId: number | undefined;
  // private directionsLayerId: string = 'directions';
  // private popup: mapboxgl.Popup | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private readonly location: Location,
    private readonly demoService: DemoService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      mapboxgl.accessToken =
        'pk.eyJ1IjoiY29vbGllbm8xLWFkbWluIiwiYSI6ImNsdWZjZGR1ZzBtZHcybnJvaHBiYTd2NzMifQ.TQ6FrqUIUUWv7J7n75A3tQ'; // Replace with your actual Mapbox access token
      this.initializeMap();
    }
  }

  ngOnDestroy() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
  navToBack() {
    this.location.back();
  }
  initializeMap() {
    this.loading = true;
    if (isPlatformBrowser(this.platformId)) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        if (position.coords.longitude) {
          this.loading = false;
        }
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.currentLocation,
          zoom: 12,
        });

        this.map.addControl(new mapboxgl.NavigationControl());

        this.userMarker = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat(this.currentLocation)
          .setPopup(new mapboxgl.Popup().setText('You are here'))
          .addTo(this.map);

        this.watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const newLocation: [number, number] = [
              pos.coords.longitude,
              pos.coords.latitude,
            ];
            this.currentLocation = newLocation;

            if (this.userMarker) {
              this.userMarker.setLngLat(newLocation);
            }
          },
          (error) => {
            this.loading = false;
            console.error('Error watching position:', error);
           
          }
        );

        this.map.on('click', (e: mapboxgl.MapMouseEvent) => {
          this.addDestinationMarker([e.lngLat.lng, e.lngLat.lat]);
        });
      });
    }
  }

  fetchSuggestions() {
    if (!this.destinationInput) {
      this.suggestions = [];
      return;
    }

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        this.destinationInput
      )}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.suggestions = data.features;
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
      });
  }

  selectSuggestion(suggestion: any) {
    this.destinationInput = suggestion.place_name;
    this.suggestions = [];
    this.addDestinationMarker(suggestion.geometry.coordinates);
  }

  addDestinationMarker(coordinates: [number, number]) {
    if (this.destinationMarker) {
      this.destinationMarker.remove();
    }
    this.destinationMarker = new mapboxgl.Marker({
      color: 'red',
      draggable: true,
    })
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setText(this.destinationInput))
      .addTo(this.map!);

    this.destinationMarker.on('dragend', () => {
      const lngLat = this.destinationMarker!.getLngLat();
      console.log(`Marker moved to: ${lngLat.lng}, ${lngLat.lat}`);
      this.reverseGeocode(lngLat.lng, lngLat.lat);
    });

    this.map!.flyTo({
      center: coordinates,
      zoom: 12,
    });

    // this.getDirections(coordinates);
  }

  reverseGeocode(lng: number, lat: number) {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          this.destinationInput = data.features[0].place_name;
          console.log(`Full address: ${data.features[0].place_name}`);
        } else {
          console.log('No address found');
        }
      })
      .catch((error) => {
        console.error('Error reverse geocoding:', error);
      });
  }

  // getDirections(destinationCoords: [number, number]) {
  //   const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.currentLocation[0]},${this.currentLocation[1]};${destinationCoords[0]},${destinationCoords[1]}?alternatives=true&geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;

  //   fetch(url)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('NoRoute');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       console.log('Directions data:', data);
  //       if (data.routes.length === 0) {
  //         throw new Error('No routes found');
  //       }

  //       if (this.map?.getSource(this.directionsLayerId)) {
  //         this.map.removeLayer(this.directionsLayerId);
  //         this.map.removeSource(this.directionsLayerId);
  //       }

  //       this.map?.addSource(this.directionsLayerId, {
  //         type: 'geojson',
  //         data: {
  //           type: 'Feature',
  //           properties: {},
  //           geometry: data.routes[0].geometry // Display first route only
  //         }
  //       });

  //       this.map?.addLayer({
  //         id: this.directionsLayerId,
  //         type: 'line',
  //         source: this.directionsLayerId,
  //         layout: {
  //           'line-join': 'round',
  //           'line-cap': 'round'
  //         },
  //         paint: {
  //           'line-color': 'red',
  //           'line-width': 5
  //         }
  //       });

  //       const bounds = new mapboxgl.LngLatBounds();
  //       data.routes[0].geometry.coordinates.forEach((point: any) => {
  //         bounds.extend(point);
  //       });
  //       this.map?.fitBounds(bounds);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching directions:', error);
  //       alert('Error: Could not find a route.');
  //     });
  // }
}
