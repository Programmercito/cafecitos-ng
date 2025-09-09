import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { ProductsModel } from '@/libs/models/products-model';
import { ProductsApiService } from '../services/products-api';
import { TableModule } from "primeng/table";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";

@Component({
  selector: 'app-products',
  imports: [ToolbarModule, ButtonModule, TableModule, IconFieldModule, InputIconModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  current_product: ProductsModel = {} as ProductsModel;
  lista: ProductsModel[] = [];
  active: boolean=true;
  name: string = '';
  page: number = 1;
  perPage: number = 20;
  constructor(private productService: ProductsApiService) {
  }
  ngOnInit(): void {
      this.getProducts();
  }
  getProducts() {
    this.productService.getProducts(this.active,this.name,this.page,this.perPage).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.lista = response.data;
        console.log('Lista:', this.lista);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    })
  }

  openNew() {
    throw new Error('Method not implemented.');
  }

}
