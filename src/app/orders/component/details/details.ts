import { Common } from '@/libs/components/Common';
import { OrderDetail } from '@/libs/models/order.model';
import { OrderDetailsApi } from '@/orders/services/order-details-api';
import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { SelectModule } from 'primeng/select';
import { ProductService } from '@/pages/service/product.service';
import { ProductsApiService } from '@/products/services/products-api';
import { PaginatedResponse } from '@/libs/models/paginated-response.model';
import { ProductsModel } from '@/libs/models/products-model';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-details',
  imports: [TableModule, FormsModule, CurrencyPipe, ButtonModule, DialogModule, SelectModule, InputNumberModule, InputTextModule],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class Details extends Common {

  orderDetDialog: boolean = false;
  currentDetail!: OrderDetail;
  types: { name: string, value: string }[] = [];
  products!: PaginatedResponse<ProductsModel>;
  product!: ProductsModel;
  openNew() {
    this.currentDetail = {} as OrderDetail;
    this.orderDetDialog = true;
  }
  details: OrderDetail[] = [];
  @Input() orderId!: number;
  constructor(private detailservice: OrderDetailsApi,
    private messageService: MessageService,
    private productService: ProductsApiService
  ) {
    super();
  }
  saveDetail() {
    this.currentDetail.product_id = this.product.id;
    this.currentDetail.order_id = this.orderId;
    console.log(this.currentDetail);
    this.detailservice.createDetail(this.currentDetail).subscribe({
      next: (response) => {
        this.getOrderDetails();
        this.hideDialog();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating order detail' });
      }
    });

  }

  hideDialog() {
    this.orderDetDialog = false;
  }
  ngOnInit() {
    this.getOrderDetails();
    this.getDetailType();
    this.getProducts();
  }
  getOrderDetails() {
    this.detailservice.getOrderDetails(this.orderId).subscribe({
      next: (response) => {
        this.details = response;
        console.log(this.details);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching order details' });
      }
    });
  }

  totalpay(): number {
    let total = 0;
    for (const detail of this.details) {
      total += parseFloat(detail.price || '0');
    }
    return total;
  }

  getDetailType() {
    this.detailservice.getProductTypes().subscribe({
      next: (response) => {
        this.types = response;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching details types' });
      }
    });
  }
  getProducts() {
    this.productService.getProducts(true, '', 1, 99999).subscribe({
      next: (response) => {
        this.products = response;
        console.log(this.products);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching products' });
      }
    });
  }
}