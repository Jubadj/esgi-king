import mongoose, {Schema, Document, Model} from "mongoose";
import {ProductProps} from "./product.model";


const setMenuSchema = new Schema({
        name: {
            type: Schema.Types.String,
            required: true
        },
        product: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "product"
        }],
        price: {
            type: Schema.Types.String,
            required: true
        },
        promo: {
            type: Schema.Types.String
        }
    },
    {
        collection: "setMenu",
        timestamps: true,
        versionKey: false
    });

export interface SetMenuProps{
    name: string;
    product: null | ProductProps[];
    price: number;
    promo?: number;
}

export type SetMenuDocument = SetMenuProps & Document;

export const SetMenuModel = mongoose.model<SetMenuDocument>("SetMenu", setMenuSchema);