import mongoose, { Document } from "mongoose";
import "./product.model";
import { UserDocument } from "./user.model";
import { RestaurantDocument } from "./restaurant.model";
export interface OrderProps {
    restaurant: null | RestaurantDocument;
    customer?: null | UserDocument;
    customerName: string | undefined;
    productList: null | String[];
    menuList: null | String[];
    price?: number;
    mode: string;
    statusPreparation?: string;
}
export declare type OrderDocument = OrderProps & Document;
export declare const OrderModel: mongoose.Model<OrderDocument, {}, {}, {}>;
