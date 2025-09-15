import { OrderDetail } from '@/libs/models/order.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-waiters',
  imports: [],
  templateUrl: './waiters.html',
  styleUrl: './waiters.scss'
})
export class Waiters {
  @Input() orderdet!: OrderDetail;
  @Input() view!: boolean;
}
