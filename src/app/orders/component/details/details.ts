import { Common } from '@/libs/components/Common';
import { OrderDetail } from '@/libs/models/order.model';
import { OrderDetailsApi } from '@/orders/services/order-details-api';
import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-details',
  imports: [TableModule, FormsModule, CurrencyPipe, ButtonModule],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class Details extends Common {
  openNew() {
    throw new Error('Method not implemented.');
  }
  details: OrderDetail[] = [];
  @Input() orderId!: number;
  constructor(private detailservice: OrderDetailsApi,
    private messageService: MessageService
  ) {
    super();
  }
  ngOnInit() {
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

}
