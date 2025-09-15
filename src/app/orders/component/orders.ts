import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { Pagination } from '@/libs/models/paginated-response.model';
import { Order } from '@/libs/models/order.model';
import { OrdersApiService } from '../services/orders-api';
import { SortIcon } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { Common } from '@/libs/components/Common';
import { Details } from "./details/details";

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule, FormsModule,
    ToolbarModule, ButtonModule, TableModule, IconFieldModule, InputIconModule,
    SelectModule, InputTextModule, DialogModule, ToastModule, ConfirmDialogModule,
    CurrencyPipe, TagModule, DatePipe, DatePickerModule, TooltipModule,
    Details
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders extends Common implements OnInit {
  viewOrder(order: Order) {
    this.currentOrder = order;
    this.orderDialog = true;
    this.view = true;
  }

  orderDialog: boolean = false;
  submitted: boolean = false;
  currentOrder!: Order;
  view: boolean = false;

  openNew() {
    this.submitted = false;
    this.view = false;
    this.ordersService.createOrder().subscribe({
      next: (order) => {
        this.currentOrder = order;
        this.orderDialog = true;
        console.log(this.currentOrder);
        this.getOrders();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating order' });
      }
    });
  }
  lista: Order[] = [];
  status: string = '';
  type: string = '';
  date_from: string = '';
  date_to: string = '';
  sort: string = 'desc';
  page: number = 1;
  perPage: number = 15;
  pagination!: Pagination;
  first: number = 0;
  total!: number;


  statusItems = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];
  orderTypes: { name: string, value: string }[] = [];

  constructor(
    private ordersService: OrdersApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    super();
  }

  ngOnInit(): void {
    const tod = new Date();
    const today = new Date(new Date().setDate(tod.getDate() + 1));
    const twoWeeksAgo = new Date(new Date().setDate(today.getDate() - 20));
    this.date_to = today.toISOString().substring(0, 10);
    this.date_from = twoWeeksAgo.toISOString().substring(0, 10);
    this.loadOrderTypes();
  }

  loadOrderTypes() {
    this.ordersService.getOrderTypes().subscribe(types => {
      this.orderTypes = types;
      console.log(this.orderTypes);
      if (this.orderTypes.length > 0) {
        this.type = this.orderTypes[0].value;
      }
      this.getOrders();
    });
  }

  getOrders() {
    const d_from = this.date_from ? new Date(this.date_from).toISOString().split('T')[0] : undefined;
    const d_to = this.date_to ? new Date(this.date_to).toISOString().split('T')[0] : undefined;

    this.ordersService.getOrders(this.type, d_from, d_to, this.sort, this.page, this.perPage).subscribe({
      next: (response) => {
        this.lista = response.data;
        this.pagination = response.pagination;
        this.total = this.pagination.total;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching orders' });
      }
    });
  }

  onPageChange(event: TablePageEvent) {
    this.first = event.first;
    this.page = Math.floor(event.first / event.rows) + 1;
    this.perPage = event.rows;
    this.getOrders();
  }

  onSort(event: any) {
    this.sort = event.field + ',' + (event.order === 1 ? 'asc' : 'desc');
    this.getOrders();
  }

  getStatusSeverity(status: string): string {
    switch (status.toUpperCase()) {
      case 'PAID':
      case 'PROCESSED':
      case 'CLOSED':
        return 'success';
      case 'COMMISSIONING':
        return 'warning';
      case 'VOIDED':
        return 'danger';
      case 'OPEN':
      default:
        return 'info';
    }
  }

  editOrder(order: Order) {
    this.currentOrder = order;
    this.orderDialog = true;
    this.view = false;
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;

  }
  onHide() {
    this.getOrders();
  }

  closeOrder(order: Order) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to close order ' + order.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.closeOrder(order.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Closed', life: 3000 });
            this.getOrders();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
          }
        });
      }
    });
  }
  paidOrder(order: Order) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to paid order ' + order.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.paidOrder(order.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order mark paid', life: 3000 });
            this.getOrders();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
          }
        });
      }
    });
  }
  voidedOrder(order: Order) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to voided order ' + order.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.voidedOrder(order.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order mark paid', life: 3000 });
            this.getOrders();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
          }
        });
      }
    });
  }
}
