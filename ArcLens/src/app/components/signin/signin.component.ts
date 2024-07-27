import { Component } from '@angular/core';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  signIn() {
    const emailElement = document.getElementById('email') as HTMLInputElement;
    const email = emailElement.value;
    const passwordElement = document.getElementById('password') as HTMLInputElement;
    const password = passwordElement.value
    if (email && password) {
      alert('Logged in successfully!');
    } else {
      alert('Please enter both email and password.');
    }
  }

  signUp() {
    alert('Redirecting to sign up...');
  }
}
