import { ProductsModel } from "./products-model";
import { UserModel } from "./user.model";

export interface OrderWaiter {
    id: number;
    order_det_id: number;
    waiter_id: number;
    comision: number | null;
    waiter: UserModel;
}

export interface OrderDetail {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: string | null;
    type: string;
    observation: string;
    product: ProductsModel;
    order_waiters: OrderWaiter[];
    entregado: number;
}

export interface Order {
    id: number;
    order_date: string;
    status: string;
    waiter_id: number;
    price_final: string;
    waiter_comision: number | null;
    updated_at: string | null;
    details: OrderDetail[];
    waiter: UserModel;
}