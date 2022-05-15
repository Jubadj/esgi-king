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
        completeAdress: {
            type: String,
            required: [true, 'Please add an adress']
        },

        admin: {
            type: Schema.Types.ObjectId,
            ref:"admin"
        },
        location: {
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            },
            formattedAddress: String
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
    const loc = await geocoder.geocoder(this.completeAdress);
    console.log(loc);
});

export interface RestaurantProps {
    name: string;
    address: string;
    city: string;
    postalCode: number;
    admin?: string; // admin._id
    completeAdress: string;

    //preparers: Preparers[];
    //deliveryMen: DeliveryMen[];
}

export type RestaurantDocument = RestaurantProps & Document;

export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);
