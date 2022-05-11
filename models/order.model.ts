import mongoose, {Schema, Document, Model} from "mongoose";
import "./product.model"
import {ProductProps} from "./product.model";
import {UserDocument, UserProps} from "./user.model";
import {RestaurantDocument, RestaurantProps} from "./restaurant.model";
import {StatusPreparation} from "../utils/order.enum";

const orderSchema = new Schema({
        restaurant: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "restaurant"
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref:"user"
        },
        customerName: {
            type: Schema.Types.String,
            required: true
        },
        menuList: [{
            type: Schema.Types.String
        }],
        productList: [{
            type: Schema.Types.String
        }],
        price: {
            type: Schema.Types.Number,
            required: true
        },
        mode: {
            type: Schema.Types.String,
            required: true
        },
        statusPreparation: {
            type: Schema.Types.String,
            default: StatusPreparation.TODO
        },
        paid: {
            type: Schema.Types.Boolean,
            default: false
        }
},
    {
        collection: "order",
        timestamps: true,
        versionKey: false
    });

export interface OrderProps{
    restaurant: null | RestaurantDocument;
    customer?: null | UserDocument;
    customerName: string | undefined;
    productList: null | String[];
    menuList: null | String[];
    price: number;
    mode: string;
    statusPreparation?: string;
    paid: boolean;
}

export type OrderDocument = OrderProps & Document;

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);