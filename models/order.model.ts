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
            required: true,
            ref:"user"
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
    productList: null | String[];
    menuList: null | String[];
    price?: number;
    mode: string;
    statusPreparation?: String;
}

export type OrderDocument = OrderProps & Document;

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);