import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";


const restaurantSchema = new Schema({

        name: {
            type: Schema.Types.String,
        },

        address: {
            type: Schema.Types.String,
        },

        city: {
            type: Schema.Types.String,
        },

        postalCode: {
            type: Schema.Types.Number,
        }

        // admin: {
        //     type: Schema.Types.ObjectId,
        //     ref:"admin"
        // },


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
    //admin: Admin
    //preparers: Preparers[];
    //deliveryMen: DeliveryMen[];
}

export type RestaurantDocument = RestaurantProps & Document;

export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);
