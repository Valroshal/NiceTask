import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import {API_REGISTER_URL, API_WEATHER_URL} from '../../consts/consts';
import {UserData, WeatherResponse} from "../../consts/types";

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

  async fetchWeatherData(latitude: number, longitude: number): Promise<Observable<WeatherResponse>> {
    // const apiWeatherUrl = API_WEATHER_URL.replace('{latitude}', latitude.toString()).replace('{longitude}', longitude.toString());
    // return this.http.get<WeatherResponse>(apiWeatherUrl);
    const response$ = this.http.post<any>(API_REGISTER_URL, {latitude, longitude});
    console.log('response$', response$)
    return await lastValueFrom(response$);
  }

}
