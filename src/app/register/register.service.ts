import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {API_REGISTER_URL} from "../../consts/consts";
import {UserData} from "../../consts/types";

@Injectable()
export class RegisterService {
  constructor(private http: HttpClient) {}

  async registerUser(user: any): Promise<any> {
    const response$ = this.http.post<UserData>(API_REGISTER_URL, user);
    return await lastValueFrom(response$);
  }
}
