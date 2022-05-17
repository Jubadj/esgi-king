import mongoose, {Schema, Document, Model} from "mongoose";

import {UserProps} from "./user.model";
import {AdminController} from "../controllers/admin.controller";
import {AdminProps} from "./admin.model";
import NodeGeocoder from "node-geocoder";
import {geocoder} from "../utils";

const restaurantSchema = new Schema({

        name: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },

        address: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },

        city: {
            type: Schema.Types.String,
            required: true
        },

        postalCode: {
            type: Schema.Types.Number,
            required: true
        },
        country: {
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


export interface RestaurantProps {
    name: string;
    address: string;
    city: string;
    postalCode: number;
    country: string;
    admin?: string; // admin._id
    //location?: string;

    //preparers: Preparers[];
    //deliveryMen: DeliveryMen[];
}

// Geocoder & create location
restaurantSchema.pre('save', async function (next){
    try {
        const loc = await geocoder.geocode({
            address: this.address,
            country: this.country,
            zipcode: this.postalCode
        });

        this.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress
        }
        //const res = await geocoder.geocode(this.completeAddress); // JS
        this.address = undefined;
        this.country = undefined;
        this.postalCode = undefined;
        console.log(loc);
    } catch (err) {
        console.error(err);
    }

    next();
});

export type RestaurantDocument = RestaurantProps & Document;
export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);
