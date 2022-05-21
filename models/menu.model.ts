import mongoose, {Schema, Document} from "mongoose";


const menuSchema = new Schema({
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
        collection: "menu",
        timestamps: true,
        versionKey: false
    });

export interface MenuProps{
    name: string;
    product: null | string[];
    price: number;
}

export type MenuDocument = MenuProps & Document;

export const MenuModel = mongoose.model<MenuDocument>("Menu", menuSchema);