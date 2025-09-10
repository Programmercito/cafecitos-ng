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
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    ToolbarModule, ButtonModule, TableModule, IconFieldModule, InputIconModule,
    SelectModule, FormsModule, InputTextModule, DialogModule, InputNumberModule,
    FileUploadModule, ToastModule, ConfirmDialogModule, CurrencyPipe, TagModule,
    Tooltip
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
  newImagePreviewUrl: SafeUrl | null = null;
  private imageCacheBuster = new Map<number, number>();

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
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer
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

  createImageUrl(id: number): SafeUrl {
    const cacheBuster = this.imageCacheBuster.get(id) || '';
    const imageUrl = `/api/products/${id}/image?_=${cacheBuster}`;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
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
    this.newImagePreviewUrl = null;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.description?.trim()) {
      const productAction = this.product.id
        ? this.productService.updateProduct(this.product.id, this.product)
        : this.productService.createProduct(this.product as Omit<ProductsModel, 'id'>);

      productAction.subscribe({
        next: (response) => {
          const successMessage = this.product.id ? 'Product Updated' : 'Product Created';
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: successMessage });

          if (this.uploadedFile) {
            this.uploadImage(response.id).subscribe(() => {
              this.getProducts();
              this.hideDialog();
            });
          } else {
            this.getProducts();
            this.hideDialog();
          }
        },
        error: (err) => {
          const errorMessage = this.product.id ? 'Error updating product' : 'Error creating product';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
      });
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
    this.newImagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(this.uploadedFile)
    );
  }

  uploadImage(productId: number): Observable<any> {
    return this.productService.uploadImage(productId, this.uploadedFile).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Image uploaded' });
        this.uploadedFile = null;
        this.imageCacheBuster.set(productId, new Date().getTime());
      }),
      catchError((err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Image upload failed' });
        return throwError(() => err);
      })
    );
  }
}