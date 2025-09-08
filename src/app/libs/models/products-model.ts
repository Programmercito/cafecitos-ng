export interface ProductsModel{
    type: string;
    description: string;
    client_price: number;
    waiter_price: number;
    animation_price: number;
    waiter_commission: number;
    is_active: boolean;
    id:number;
}