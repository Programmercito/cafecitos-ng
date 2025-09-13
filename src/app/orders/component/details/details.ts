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

@Component({
  selector: 'app-details',
  imports: [TableModule, FormsModule, CurrencyPipe, ButtonModule, DialogModule, SelectModule],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class Details extends Common {
  saveProduct() {
  }
  hideDialog() {
  }
  orderDetDialog: boolean = false;
  currentDetail!: OrderDetail;
  types: {name: string, value: string}[] = [];
  openNew() {
    this.currentDetail = {} as OrderDetail;
    this.orderDetDialog = true;
  }
  details: OrderDetail[] = [];
  @Input() orderId!: number;
  constructor(private detailservice: OrderDetailsApi,
    private messageService: MessageService
  ) {
    super();
  }
  ngOnInit() {
    this.getOrderDetails();
    this.getDetailType();
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
}