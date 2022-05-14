import mongoose, {Schema, Document, Model} from "mongoose";
import "./product.model"
import {ProductProps} from "./product.model";


const orderSchema = new Schema({
        restaurant: {
            type: Schema.Types.ObjectId,
            required: true
        },
        customer: {
            type: Schema.Types.String,
            required: true
        },
        productList: [{
            type: Schema.Types.ObjectId,
            ref: "product"
        }],
        date: {
            type: Schema.Types.Date,
            required: true
        },
        price: {
            type: Schema.Types.Number,
            required: true
        }
    },
    {
        collection: "order",
        timestamps: true,
        versionKey: false
    });

export interface OrderProps{
    restaurant: string;
    customer: string;
    date: Date;
    productList: null | ProductProps[];
    price: number;
}

export type OrderDocument = OrderProps & Document;

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);