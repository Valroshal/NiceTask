import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from './register.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH} from "../../consts/consts";
import {UserData} from "../../consts/types";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent {
  user: UserData = {} as UserData;
  error: string = '';
  registerForm: FormGroup;
  passwordMinLen = PASSWORD_MIN_LENGTH;
  passwordMaxLen = PASSWORD_MAX_LENGTH;

  constructor(private registerService: RegisterService, private router: Router, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH), Validators.maxLength(PASSWORD_MAX_LENGTH)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    }

    this.user = { ...this.registerForm.value };
    try {

      const response: UserData = await this.registerService.registerUser(this.user);
      if (response.token) {
        // We don't want to save token to local storage to login from the login page
        // Redirect to login page if succeed
        await this.router.navigate(['/login']);

      }
    } catch (error: any) {
      if (error.error) {
        this.error = error.error;
      } else {
        // Display general error
        this.error = 'An error occurred. Please try again later.';
      }
    }
  }
}
