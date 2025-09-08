import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { ProductsModel } from '@/libs/models/products-model';

@Component({
  selector: 'app-products',
  imports: [ToolbarModule, ButtonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  current_product: ProductsModel = {} as ProductsModel;
  lista: ProductsModel[] = [];

  constructor() {

  }
  ngOnInit() {
  }

  openNew() {
    throw new Error('Method not implemented.');
  }

}
