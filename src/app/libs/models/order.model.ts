export interface Order {
    id: number;
    status: string;
    total: number;
    created_at: string;
    waiter?: {
        name: string;
    };
    client?: {
        name: string;
    };
    items: any[];
}
