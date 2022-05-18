import mongoose, {Schema, Document} from "mongoose";
import "./product.model";
import {UserDocument} from "./user.model";
import {RestaurantDocument} from "./restaurant.model";
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
        },
        deliveryMan: {
            type: Schema.Types.ObjectId,
            ref:"user"
        },
        preparer: {
            type: Schema.Types.ObjectId,
            ref:"user"
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
    preparer?: null | UserDocument;
    deliveryMan?: null | UserDocument;
}

export type OrderDocument = OrderProps & Document;

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);