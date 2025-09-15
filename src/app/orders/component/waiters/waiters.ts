import { OrderDetail, OrderWaiter } from '@/libs/models/order.model';
import { UserModel } from '@/libs/models/user.model';
import { OrderWaiterApi } from '@/orders/services/order-waiter-api';
import { UsersApiService } from '@/users/services/users-api';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-waiters',
  imports: [SelectModule, FormsModule, TableModule],
  templateUrl: './waiters.html',
  styleUrl: './waiters.scss'
})
export class Waiters {
  @Input() orderdet!: OrderDetail;
  @Input() view!: boolean;
  waiters: UserModel[] = [];
  orderswaiters: OrderWaiter[] = [];
  waiter: UserModel = {} as UserModel;

  constructor(private userservice: UsersApiService,
    private messageservice: MessageService,
    private orderswaitersservice: OrderWaiterApi
  ) {

  }
  ngOnInit() {
    this.getWaiters();
    this.orderswaiters=this.orderdet.order_waiters;
  }
  getWaiters() {
    this.userservice.getWaiters('').subscribe({
      next: (response) => {
        this.waiters = response;
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
}