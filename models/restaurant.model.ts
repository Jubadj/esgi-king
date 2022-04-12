import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";
import {AdminController} from "../controllers/admin.controller";
import {AdminProps} from "./admin.model";


const restaurantSchema = new Schema({

        name: {
            type: Schema.Types.String,
            required: true
        },

        address: {
            type: Schema.Types.String,
            required: true
        },

        city: {
            type: Schema.Types.String,
            required: true
        },

        postalCode: {
            type: Schema.Types.Number,
            required: true
        },

        admin: {
            type: Schema.Types.ObjectId,
            ref:"admin"
        },


        //admin
        // preparers: [{
        //     type: Schema.Types.ObjectId,
        //     ref: "preparers"
        // }],
        //
        // deliveryMen: [{
        //     type: Schema.Types.ObjectId,
        //     ref: "deliveryMen"
        // }]
    },


    {
        collection: "restaurant",
        timestamps: true,
        versionKey: false
    });

export interface RestaurantProps {
    name: string;
    address: string;
    city: string;
    postalCode: number;
    admin?: string; // admin._id

    //preparers: Preparers[];
    //deliveryMen: DeliveryMen[];
}

export type RestaurantDocument = RestaurantProps & Document;

export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);
