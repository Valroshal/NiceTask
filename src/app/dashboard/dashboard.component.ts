import {Component, OnInit} from '@angular/core';
import {WeatherService} from './dashboard.service';
import {WeatherData, WeatherResponse} from "../../consts/types";
import {lastValueFrom, Observable} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-weather',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  weatherData: WeatherData = {} as WeatherData;

  constructor(private weatherService: WeatherService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.getWeatherData().then();
  }

  async getWeatherData() {
    try {
      const locationResponse: Observable<GeolocationPosition> = this.weatherService.getUserLocation();
      const position: GeolocationPosition = await lastValueFrom(locationResponse);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const weatherResponse$: Observable<WeatherResponse> = await this.weatherService.fetchWeatherData(latitude, longitude);
      const weatherResponse: WeatherResponse = await lastValueFrom(weatherResponse$);
      this.weatherData = weatherResponse.current_weather;

      // Format the string
      this.weatherData.time = this.datePipe.transform(new Date(weatherResponse.current_weather.time), 'yyyy-MM-dd HH:mm') || weatherResponse.current_weather.time;
      console.log('this.weatherData', this.weatherData)
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
}
