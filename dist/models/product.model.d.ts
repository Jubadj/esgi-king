import mongoose, { Document } from "mongoose";
export interface ProductProps {
    name: string;
    weight: number;
    calories: number;
    type?: string;
    count: number;
    price: number;
}
export declare type ProductDocument = ProductProps & Document;
export declare const ProductModel: mongoose.Model<ProductDocument, {}, {}, {}>;
