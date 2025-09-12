import { ProductsModel } from './products-model';

export interface OrderDetail {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  type: string;
  observation: string;
  product?: ProductsModel;
}