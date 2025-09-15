import { OrderDetail, OrderWaiter } from '@/libs/models/order.model';
import { UserModel } from '@/libs/models/user.model';
import { OrderWaiterApi } from '@/orders/services/order-waiter-api';
import { UsersApiService } from '@/users/services/users-api';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { Button } from "primeng/button";
import { Common } from '@/libs/components/Common';

@Component({
  selector: 'app-waiters',
  imports: [SelectModule, FormsModule, TableModule, Button],
  templateUrl: './waiters.html',
  styleUrl: './waiters.scss'
})
export class Waiters extends Common {

  addWaiter() {
    this.orderWaiter = {} as OrderWaiter;
    this.orderWaiter.order_det_id = this.orderdet.id;
    this.orderWaiter.waiter_id = this.waiter.id!;
    this.insertOrderWaiter(this.orderWaiter);
  }
  insertOrderWaiter(orderWaiter: OrderWaiter) {
    this.orderswaitersservice.createWaiterDetail(orderWaiter).subscribe({
      next: (response) => {
        this.getOrderWaiters(this.orderdet.id!);
      },
      error: (error) => {
        this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Error creating order waiter' });
      }
    });
  }

  @Input() orderdet!: OrderDetail;
  @Input() view!: boolean;
  waiters: UserModel[] = [];
  orderswaiters: OrderWaiter[] = [];
  waiter: UserModel = {} as UserModel;
  orderWaiter!: OrderWaiter;

  constructor(private userservice: UsersApiService,
    private messageservice: MessageService,
    private orderswaitersservice: OrderWaiterApi,
    private confirmationService: ConfirmationService
  ) {
    super();
  }
  ngOnInit() {
    this.getWaiters();
    console.log(this.orderdet);
    this.orderswaiters = this.orderdet.order_waiters;

  }
  getWaiters() {
    this.userservice.getWaiters('').subscribe({
      next: (response) => {
        this.waiters = response;
        console.log('waiters', this.waiters);
      },
      error: (error) => {
        this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Error fetching waiters' });
      }
    });
  }
  getOrderWaiters(orderdetailid: number) {
    this.orderswaitersservice.getOrderWaiters(orderdetailid).subscribe({
      next: (response) => {
        this.orderswaiters = response;
      },
      error: (error) => {
        this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Error fetching order waiters' });
      }
    });
  }
  deleteWaiterapi(id: number) {
    this.orderswaitersservice.deleteWaiterDetail(id).subscribe({
      next: (response) => {
        this.getOrderWaiters(this.orderdet.id!);
      },
      error: (error) => {
        this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Error deleting order waiter' });
      }
    });
  }
  deleteWaiter(ordetwaiter: OrderWaiter) {
    this.confirmationService.confirm({
      message: 'Are you sure you want delete order Waiter ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteWaiterapi(ordetwaiter.id);
      }
    });

  }
}