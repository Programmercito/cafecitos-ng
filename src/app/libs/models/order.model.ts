export interface Order {
  id: number;
  status: string;
  waiter?: {
    username: string;
  };
  order_date: string; // ISO date string
  price_final: number;
  waiter_commission: number;
  updated_at: string; // ISO date string
}
