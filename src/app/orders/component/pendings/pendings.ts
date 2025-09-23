import { Common } from '@/libs/components/Common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { OrderDetailsApi } from '@/orders/services/order-details-api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderDetail } from '@/libs/models/order.model';
import { ButtonModule } from "primeng/button";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pendings',
  imports: [Toast, ConfirmDialogModule, TableModule, ButtonModule, FormsModule],
  templateUrl: './pendings.html',
  styleUrl: './pendings.scss',
  providers: [MessageService, ConfirmationService]
})
export class Pendings extends Common implements OnInit {
  ngclass(row: OrderDetail) {
    const colorlist: string[] = this.getArrayColors();
    const indice = (row.order_id % colorlist.length);
    const color = colorlist[indice];
    const style = "!bg-primary-" + color + " !text-primary-contrast";
    return style;
  }

  refresh() {
    this.getPendings();
  }

  lista: OrderDetail[] = [];
  constructor(private route: Router,
    private detailsservice: OrderDetailsApi,
    private messageservice: MessageService,
    private confirmationservice: ConfirmationService) {
    super();
    if (!this.getCurrentUser().id) {
      this.route.navigate(['/auth/login']);
    }
  }
  ngOnInit(): void {
    if (this.getCurrentUser().type === 'ADMINISTRATOR' || this.getCurrentUser().type === 'IN_CHARGE') {
      this.getPendings();
    }
  }
  getPendings() {
    this.detailsservice.pendings().subscribe({
      next: (response) => {
        this.lista = response;
      },
      error: (error) => {
        this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Error fetching orders pending' });
      }
    });
  }
  entregadoDetail(detail: OrderDetail) {
    this.confirmationservice.confirm({
      message: 'Would you like to mark the order as delivered?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.detailsservice.markEntregado(detail.id).subscribe({
          next: (response) => {
            this.messageservice.add({ severity: 'success', summary: 'Exito', detail: 'El producto ha sido marcado como entregado' });
            this.getPendings();
          },
          error: (err) => {
            this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Error update detail order' });
          }

        });
      }
    });
  }
}