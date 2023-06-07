import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import {lastValueFrom, Observable} from 'rxjs';
import {UserData, ValidateTokenResponse, WeatherData} from "../../consts/types";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  user: UserData = {} as UserData;
  error: string = '';

  loginForm: FormGroup;

  constructor(private loginService: LoginService, private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    // Validate token on page mount
    try {
      const response$: Observable<ValidateTokenResponse> = this.loginService.validateToken();
      const response: ValidateTokenResponse = await lastValueFrom(response$);
      if (response.message === 'Access granted') {
        await this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.user = {...this.loginForm.value};

    try {
      const response$: Observable<UserData> = this.loginService.loginUser(this.user);
      const response: UserData = await lastValueFrom(response$);

      if (response.token) {
        // Redirect to dashboard on successful login
        await this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      if (error.error) {
        this.error = error.error;
      } else {
        this.error = 'An error occurred. Please try again later.';
      }
    }
  }
}
