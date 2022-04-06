import mongoose, {Schema, Document, Model} from "mongoose";


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
            type: Schema.Types.String,
            required: true
        }
    },
    {
        collection: "setMenus",
        timestamps: true,
        versionKey: false
    });

export interface SetMenuProps{
    name: string;
    product: string;
    price: number;
}

export type SetMenuDocument = SetMenuProps & Document;

export const SetMenuModel = mongoose.model<SetMenuDocument>("SetMenu", setMenuSchema);