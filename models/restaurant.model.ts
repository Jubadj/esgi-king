import mongoose, {Schema, Document, Model} from "mongoose";

import {UserProps} from "./user.model";
import {AdminController} from "../controllers/admin.controller";
import {AdminProps} from "./admin.model";

const geocoder = require('../utils/geocoder')

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
        completeAddress: {
            type: Schema.Types.String,
            required: true
        },

        admin: {
            type: Schema.Types.ObjectId,
            ref:"admin"
        },
        location: {
            type: {
                type: Schema.Types.String,
                enum: ['Point']
            },
            coordinates: {
                type: [Schema.Types.Number],
                index: '2dsphere'
            },
            formattedAddress: Schema.Types.String
        }

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

// Geocoder & create location
restaurantSchema.pre('save', async function (next){
    const loc = await geocoder.geocoder(this.completeAddress);
    console.log(loc);

    this.completeAddress = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress
    }

    //Do not save address
    this.completeAddress = undefined;
    next();
});

export interface RestaurantProps {
    name: string;
    address: string;
    city: string;
    postalCode: number;
    completeAddress: string;
    admin?: string; // admin._id
    location?: string;

    //preparers: Preparers[];
    //deliveryMen: DeliveryMen[];
}

export type RestaurantDocument = RestaurantProps & Document;
export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);
