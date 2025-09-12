import { Users } from "../models/Users";

export class Common {
    public getCurrentUser(): Users {
        let user: Users = JSON.parse(sessionStorage.getItem("user") || '{}');
        return user;
    }
}