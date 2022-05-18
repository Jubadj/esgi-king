import mongoose, {Schema, Document} from "mongoose";
import "./product.model";


const discountSchema = new Schema({
        code: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        expirationDate: {
            type: Schema.Types.Date
        },
        percent: {
            type: Schema.Types.Number
        }
    },
    {
        collection: "discount",
        timestamps: true,
        versionKey: false
    });

export interface DiscountProps{
    code: string,
    expirationDate: Date,
    percent: number
}

export type DiscountDocument = DiscountProps & Document;

export const DiscountModel = mongoose.model<DiscountDocument>("Discount", discountSchema);