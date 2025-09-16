import { WaitersCommissions } from '@/libs/models/waiters-commissions';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-commisions',
  imports: [TableModule],
  templateUrl: './commisions.html',
  styleUrl: './commisions.scss'
})
export class Commisions {
  @Input() lista!: WaitersCommissions[];
  getProfitsTotal() {
    let total = 0;
    this.lista.forEach(element => {
      total = total + element.price;
    });
    return total;
  }
}
