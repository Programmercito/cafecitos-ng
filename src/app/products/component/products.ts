import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { ProductsModel } from '@/libs/models/products-model';
import { ProductsApiService } from '../services/products-api';
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
import { CurrencyPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-products',
  imports: [
    ToolbarModule, ButtonModule, TableModule, IconFieldModule, InputIconModule, 
    SelectModule, FormsModule, InputTextModule, DialogModule, InputNumberModule,
    FileUploadModule, ToastModule, ConfirmDialogModule, CurrencyPipe, TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  productDialog: boolean = false;
  submitted: boolean = false;
  product!: ProductsModel;
  uploadedFile: any;

  lista: ProductsModel[] = [];
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

  productTypes: {name: string, value: string}[] = [];
  statusOptions = [{name: 'Active', value: true}, {name: 'Inactive', value: false}];

  constructor(
    private productService: ProductsApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.loadProductTypes();
  }

  loadProductTypes() {
    this.productService.getProductTypes().subscribe(types => {
      this.productTypes = types;
    });
  }

  getProducts() {
    this.productService.getProducts(this.active, this.name, this.page, this.perPage).subscribe({
      next: (response) => {
        this.lista = response.data;
        this.pagination = response.pagination;
        this.total = this.pagination.total;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching products' });
      }
    });
  }

  filterByName(name: string) {
    this.name = name;
    this.page = 1;
    this.first = 0;
    this.getProducts();
  }

  onChangeActive($event: boolean) {
    this.active = $event;
    this.getProducts();
  }

  onPageChange($event: TablePageEvent) {
    this.first = $event.first;
    this.page = Math.floor($event.first / $event.rows) + 1;
    this.getProducts();
  }

  openNew() {
    this.product = {} as ProductsModel;
    this.product.is_active = true;
    if (this.productTypes.length > 0) {
      this.product.type = this.productTypes[0].value;
    }
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: ProductsModel) {
    this.product = { ...product };
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.description?.trim()) {
      if (this.product.id) {
        this.productService.updateProduct(this.product.id, this.product).subscribe({
          next: (response) => {
            if (this.uploadedFile) {
              this.uploadImage(response.id);
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated' });
            this.getProducts();
            this.hideDialog();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating product' });
          }
        });
      } else {
        this.productService.createProduct(this.product).subscribe({
          next: (response) => {
            if (this.uploadedFile) {
              this.uploadImage(response.id);
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created' });
            this.getProducts();
            this.hideDialog();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating product' });
          }
        });
      }
    }
  }

  changeStatus(product: ProductsModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to change the status of ' + product.description + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.changeStatus(product.id, !product.is_active).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Status Changed' });
            this.getProducts();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error changing status' });
          }
        });
      }
    });
  }

  onUpload(event: any) {
    this.uploadedFile = event.files[0];
  }

  uploadImage(productId: number) {
    this.productService.uploadImage(productId, this.uploadedFile).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Image uploaded' });
        this.uploadedFile = null;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Image upload failed' });
      }
    });
  }
}
