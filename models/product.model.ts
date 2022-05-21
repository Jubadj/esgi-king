import mongoose, {Schema, Document, Model} from "mongoose";


const productSchema = new Schema({
        name: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        weight: {
            type: Schema.Types.Number,
            required: true
        },
        count: {
            type: Schema.Types.Number,
            required: true
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
    count: number;
    price: number;
}

export type ProductDocument = ProductProps & Document;

export const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);