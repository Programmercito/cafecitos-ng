import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { UserModel } from '@/libs/models/user.model';
import { UsersApiService } from '../services/users-api';
import { Table, TableModule, TablePageEvent } from "primeng/table";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { Pagination } from '@/libs/models/paginated-response.model';
import { SelectModule } from "primeng/select";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    ToolbarModule, ButtonModule, TableModule, IconFieldModule, InputIconModule, 
    SelectModule, FormsModule, InputTextModule, DialogModule, InputNumberModule,
    FileUploadModule, ToastModule, ConfirmDialogModule, TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  userDialog: boolean = false;
  submitted: boolean = false;
  user!: UserModel;
  uploadedFile: any;
  newImagePreviewUrl: SafeUrl | null = null;
  private imageCacheBuster = new Map<number, number>();

  lista: UserModel[] = [];
  active: boolean = true;
  name: string = '';
  page: number = 1;
  perPage: number = 10;
  pagination!: Pagination;
  first: number = 0;
  total!: number;
  dropdownItems = [
    { name: 'Active', code: true },
    { name: 'Inactive', code: false },
  ];

  userTypes: {name: string, value: string}[] = [];
  statusOptions = [{name: 'Active', value: true}, {name: 'Inactive', value: false}];

  constructor(
    private usersService: UsersApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.loadUserTypes();
  }

  loadUserTypes() {
    this.usersService.getUsersType().subscribe(types => {
      this.userTypes = types;
    });
  }

  createImageUrl(id: number): SafeUrl {
    // Users do not have images, return empty string or a placeholder image URL
    return this.sanitizer.bypassSecurityTrustUrl(''); 
  }

  getUsers() {
    this.usersService.getUsers(this.active, this.name, this.page, this.perPage).subscribe({
      next: (response) => {
        this.lista = response.data;
        this.pagination = response.pagination;
        this.total = this.pagination.total;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching users' });
      }
    });
  }

  filterByName(name: string) {
    this.name = name;
    this.page = 1;
    this.first = 0;
    this.getUsers();
  }

  onChangeActive($event: boolean) {
    this.active = $event;
    this.getUsers();
  }

  onPageChange($event: TablePageEvent) {
    this.first = $event.first;
    this.page = Math.floor($event.first / $event.rows) + 1;
    this.getUsers();
  }

  openNew() {
    this.user = {} as UserModel;
    this.user.is_active = true;
    if (this.userTypes.length > 0) {
      this.user.type = this.userTypes[0].value;
    }
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: UserModel) {
    this.user = { ...user };
    this.userDialog = true;
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
    this.newImagePreviewUrl = null;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.username?.trim() && this.user.first_name?.trim() && this.user.last_name?.trim()) {
      const userAction = this.user.id
        ? this.usersService.updateUser(this.user.id, this.user)
        : this.usersService.createUser(this.user as Omit<UserModel, 'id' | 'is_active'>);

      userAction.subscribe({
        next: (response) => {
          const successMessage = this.user.id ? 'User Updated' : 'User Created';
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: successMessage });

          // No image upload for users, so directly refresh and close
          this.getUsers();
          this.hideDialog();
        },
        error: (err) => {
          const errorMessage = this.user.id ? 'Error updating user' : 'Error creating user';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
      });
    }
  }

  changeStatus(user: UserModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to change the status of ' + user.username + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.changeStatus(user.id!, !user.is_active).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Status Changed' });
            this.getUsers();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error changing status' });
          }
        });
      }
    });
  }

  onUpload(event: any) {
    // Users do not have images, this method is not used
  }

  uploadImage(userId: number): Observable<any> {
    // Users do not have images, this method is not used
    return of(null);
  }
}