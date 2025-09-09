import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { ProductsModel } from '@/libs/models/products-model';
import { ProductsApiService } from '../services/products-api';
import { TableModule, TablePageEvent } from "primeng/table";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { Pagination } from '@/libs/models/paginated-response.model';

@Component({
  selector: 'app-products',
  imports: [ToolbarModule, ButtonModule, TableModule, IconFieldModule, InputIconModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {

  current_product: ProductsModel = {} as ProductsModel;
  lista: ProductsModel[] = [];
  active: boolean = true;
  name: string = '';
  page: number = 1;
  perPage: number = 2;
  pagination!: Pagination;
  first: number = 0;
  total!:number;
  constructor(private productService: ProductsApiService) {
  }

  ngOnInit(): void {
    this.getProducts();
  }
  get currentPage(): number {
    return Math.floor(this.first / this.perPage) + 1;
  }
  onPageChange($event: TablePageEvent) {
    this.first = $event.first;
    this.page = this.currentPage;
    this.getProducts();


  }
  getProducts() {
    this.productService.getProducts(this.active, this.name, this.page, this.perPage).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.lista = response.data;
        this.pagination = response.pagination;
        this.total = this.pagination.total;
        //this.total=this.pagination.total;
        console.log('Lista:', this.lista);
        console.log('Total:', this.total);
        console.log('Pagination:', this.pagination);
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
