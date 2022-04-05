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
        calory: {
            type: Schema.Types.Number,
            required: true
        },
        foodType: {
            type: Schema.Types.String
        },
        price: {
            type: Schema.Types.String,
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
    calory: number;
    foodType?: string;
    price: number;
}

export type ProductDocument = ProductProps & Document;

export const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);