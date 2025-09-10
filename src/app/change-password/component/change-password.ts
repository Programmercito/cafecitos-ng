import { Component, OnInit } from '@angular/core';
import { UsersApiService } from 'src/app/users/services/users-api'; // Adjust path if needed
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from "primeng/fluid";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    FluidModule
  ],
  providers: [MessageService],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword implements OnInit {
  current_password!: string;
  new_password!: string;
  new_password_confirmation!: string;
  submitted: boolean = false;

  constructor(
    private usersService: UsersApiService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // No specific initialization needed for this component
  }

  changePassword() {
    this.submitted = true;

    if (this.current_password && this.new_password && this.new_password_confirmation) {
      if (this.new_password !== this.new_password_confirmation) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'New password and confirmation do not match.' });
        return;
      }

      this.usersService.changePassword(this.current_password, this.new_password).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Password changed successfully.' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to change password.' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields.' });
    }
    this.current_password = "";
    this.new_password = "";
    this.new_password_confirmation = "";

  }
}