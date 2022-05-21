import mongoose, {Schema, Document, Model} from "mongoose";
import {ProductProps} from "./product.model";


const setMenuSchema = new Schema({
        name: {
            type: Schema.Types.String,
            required: true
        },
        product: [{
            type: Schema.Types.String,
            required: true
        }],
        price: {
            type: Schema.Types.Number,
            required: true
        }
    },
    {
        collection: "setMenu",
        timestamps: true,
        versionKey: false
    });

export interface SetMenuProps{
    name: string;
    product: null | string[];
    price: number;
}

export type SetMenuDocument = SetMenuProps & Document;

export const SetMenuModel = mongoose.model<SetMenuDocument>("SetMenu", setMenuSchema);