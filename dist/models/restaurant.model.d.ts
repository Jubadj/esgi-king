import { Document, Model } from "mongoose";
export interface RestaurantProps {
    name: string;
    address: string;
    city: string;
    postalCode: number;
    admin?: string;
}
export declare type RestaurantDocument = RestaurantProps & Document;
export declare const RestaurantModel: Model<RestaurantDocument>;
