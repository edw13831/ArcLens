import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  showModal: boolean = false;

  show() {
    this.showModal = true;
  }

  hide() {
    this.showModal = false;
  }

  onSignup() {
    // Implement signup logic here
    console.log('User signed up!');
    this.hide();
  }
}
