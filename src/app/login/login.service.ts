import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {API_LOGIN_URL, API_VALIDATE_TOKEN_URL} from "../../consts/consts";
import {UserData, ValidateTokenResponse} from "../../consts/types";

@Injectable()
export class LoginService {
  private token: string;

  constructor(private http: HttpClient) {
    // Get token from local storage on service initialization
    this.token = localStorage.getItem('token') || '';
  }

  // Validate the token on service initialization
  validateToken(): Observable<ValidateTokenResponse> {
    if (this.token !== '') {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      let options = { headers: headers };
      return this.http.get<ValidateTokenResponse>(API_VALIDATE_TOKEN_URL, options).pipe(
        tap((response: ValidateTokenResponse) => {
          return response;
        })
      );
    } else {
      return of();
    }
  }

  loginUser(user: UserData): Observable<UserData> {
    return this.http.post<UserData>(API_LOGIN_URL, user).pipe(
      tap((response: UserData) => {
        if (response.token) {
          this.token = response.token;
          localStorage.setItem('token', this.token);
        }
      })
    );
  }
}
