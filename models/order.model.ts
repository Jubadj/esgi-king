import mongoose, {Schema, Document, Model} from "mongoose";
import "./product.model"


const orderSchema = new Schema({
        orderHost: {
            type: Schema.Types.String,
            required: true
        },
        productList: [{
            type: Schema.Types.ObjectId,
            ref: "product"
        }],
        price: {
            type: Schema.Types.String,
            required: true
        }
    },
    {
        collection: "orders",
        timestamps: true,
        versionKey: false
    });

export interface OrderProps{
    firstname: string;
    lastname: number;
    birthdate: number;
}

export type OrderDocument = OrderProps & Document;

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);