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
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '@/users/services/users-api';
import { Commisions } from "./commisions/commisions";
import { WaitersCommissions } from '@/libs/models/waiters-commissions';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule, FormsModule,
    ToolbarModule, ButtonModule, TableModule, IconFieldModule, InputIconModule,
    SelectModule, InputTextModule, DialogModule, ToastModule, ConfirmDialogModule,
    CurrencyPipe, TagModule, DatePipe, DatePickerModule, TooltipModule,
    Details,
    Commisions
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders extends Common implements OnInit {
  commisionDialog: boolean = false;
  logout() {
    sessionStorage.removeItem('user');
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Confirm Logout',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.logout().subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Logged out successfully' });
            this.router.navigate(['/auth/login']);
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Logout failed' });
            this.router.navigate(['/auth/login']);
          }
        });
      }
    });


  }
  viewOrder(order: Order) {
    this.currentOrder = order;
    this.orderDialog = true;
    this.view = true;
  }

  orderDialog: boolean = false;
  submitted: boolean = false;
  currentOrder!: Order;
  view: boolean = false;
  typedisabled: boolean = false;

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
  typeorders: string = '';
  statusItems = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];
  commissions: WaitersCommissions[] = [];
  orderTypes: { name: string, value: string }[] = [];

  constructor(
    private ordersService: OrdersApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private usersService: UsersApiService,
    private router: Router
  ) {

    super();

  }

  ngOnInit(): void {
    const tod = new Date();
    const today = new Date(new Date().setDate(tod.getDate() + 1));
    const twoWeeksAgo = new Date(new Date().setDate(today.getDate() - 60));
    this.date_to = today.toISOString().substring(0, 10);
    this.date_from = twoWeeksAgo.toISOString().substring(0, 10);
    this.loadOrderTypes();
    this.route.params.subscribe(params => {
      this.typeorders = params['typeorders'];
      this.loadOrderTypes();
    });


  }

  loadOrderTypes() {
    this.ordersService.getOrderTypes().subscribe(types => {
      this.orderTypes = types;
      console.log(this.orderTypes);
      if (this.orderTypes.length > 0 && (this.typeorders === 'me' || this.typeorders === 'history')) {
        this.type = this.orderTypes[0].value;
        this.typedisabled = false;
      } else if (this.typeorders === 'commissiong') {
        this.type = 'PAID';
        this.typedisabled = true;
      } else if (this.typeorders === 'processing') {
        this.type = 'COMMISSIONING';
        this.typedisabled = true;
      } else if (this.typeorders === 'processed') {
        this.type = 'PROCESSED';
        this.typedisabled = true;
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
  commisioning() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to commission the orders? Remember that all orders in a "paid" status will change to "commissioning," not just the ones you see on the screen. ',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.moveToCommissiong().subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Orders mark how to commissioning', life: 3000 });
            this.getOrders();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
          }
        });
      }
    });
  }
  processing() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to process the orders? Remember that all orders in a "commissioning" status will change to "processed," not just the ones you see on the screen.',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.moveToProcessed().subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order mark how to processing', life: 3000 });
            this.getOrders();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
          }
        });
      }
    });
  }
  commisions() {
    const d_from = this.date_from ? new Date(this.date_from).toISOString().split('T')[0] : undefined;
    const d_to = this.date_to ? new Date(this.date_to).toISOString().split('T')[0] : undefined;
    this.ordersService.getCommissions(this.type, d_from, d_to, 'asc').subscribe({
      next: (response) => {
        this.commissions = response;
        this.commisionDialog = true;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching commissions' });
      }
    });
  }
}
