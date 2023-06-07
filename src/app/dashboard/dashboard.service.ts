import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_WEATHER_URL } from '../../consts/consts';
import {WeatherResponse} from "../../consts/types";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getUserLocation(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            observer.next(position);
            observer.complete();
          },
          (error: any) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not supported by this browser.');
      }
    });
  }

  fetchWeatherData(latitude: number, longitude: number): Observable<WeatherResponse> {
    const apiWeatherUrl = API_WEATHER_URL.replace('{latitude}', latitude.toString()).replace('{longitude}', longitude.toString());
    return this.http.get<WeatherResponse>(apiWeatherUrl);
  }

}
