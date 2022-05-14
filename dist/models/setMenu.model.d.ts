import mongoose, { Document } from "mongoose";
export interface SetMenuProps {
    name: string;
    product: null | string[];
    price: number;
}
export declare type SetMenuDocument = SetMenuProps & Document;
export declare const SetMenuModel: mongoose.Model<SetMenuDocument, {}, {}, {}>;
