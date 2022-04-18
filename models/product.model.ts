import mongoose, {Schema, Document, Model} from "mongoose";


const productSchema = new Schema({
        name: {
            type: Schema.Types.String,
            required: true
        },
        weight: {
            type: Schema.Types.Number,
            required: true
        },
        calories: {
            type: Schema.Types.Number,
            required: true
        },
        // Vegetarian or with meat
        type: {
            type: Schema.Types.String
        },
        price: {
            type: Schema.Types.Number,
            required: true
        }
    },
    {
        collection: "products",
        timestamps: true,
        versionKey: false
    });

export interface ProductProps{
    name: string;
    weight: number;
    calories: number;
    type?: string;
    price: number;
}

export type ProductDocument = ProductProps & Document;

export const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);