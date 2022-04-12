import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";
import {RestaurantDocument, RestaurantProps} from "./restaurant.model";



const adminSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'restaurant'
    }
},
    {
    collection: "admin",
    timestamps: true,
    versionKey: false
});

export interface AdminProps {
    username: string;
    restaurant?: string; // restaurant's id
}

export type AdminDocument = AdminProps & Document;

export const AdminModel: Model<AdminDocument> = mongoose.model<AdminDocument>("Admin", adminSchema);
