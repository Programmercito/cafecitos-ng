export interface UserModel {
    id?: number;
    username: string;
    password?: string;
    is_active: boolean;
    type: string;
    first_name: string;
    last_name: string;
}