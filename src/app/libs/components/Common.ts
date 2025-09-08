import { Users } from "../models/users";

export class Common{
    getCurrectUser():Users{
        let user:Users=JSON.parse(sessionStorage.getItem("user") || '{}');
        return user;
    }
}