import mongoose, {Schema, Document, Model} from "mongoose";
import "./product.model"
import {ProductProps} from "./product.model";
import {StatusPreparation} from "../enums";


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
        price: {
            type: Schema.Types.Number,
            required: true
        },
        statusPreparation: {
            type: Schema.Types.String,
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
    productList: null | ProductProps[];
    price: number;
    statusPreparation: String;
}

export type OrderDocument = OrderProps & Document;

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);