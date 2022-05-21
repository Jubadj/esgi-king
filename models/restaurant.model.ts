import mongoose, {Schema, Document, Model} from "mongoose";

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
        // location: {
        //     type: {
        //         type: Schema.Types.String,
        //         enum: ['Point']
        //     },
        //     coordinates: {
        //         type: [Schema.Types.Number],
        //         index: '2dsphere'
        //     },
        //     formattedAddress: Schema.Types.String
        // }
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
}
//
// // Geocoder & create location
// restaurantSchema.pre('save', async function (next){
//     try {
//         const loc = await geocoder.geocode({
//             address: this.address,
//             country: this.country,
//             zipcode: this.postalCode
//         });
//
//         this.location = {
//             type: 'Point',
//             coordinates: [loc[0].longitude, loc[0].latitude],
//             formattedAddress: loc[0].formattedAddress
//         }
//         this.address = undefined;
//         this.country = undefined;
//         this.postalCode = undefined;
//         console.log(loc);
//     } catch (err) {
//         console.error(err);
//     }
//
//     next();
// });

export type RestaurantDocument = RestaurantProps & Document;
export const RestaurantModel: Model<RestaurantDocument> = mongoose.model<RestaurantDocument>("Restaurant", restaurantSchema);
