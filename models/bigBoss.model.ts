import mongoose, {Schema, Document, Model} from "mongoose";
import {UserProps} from "./user.model";



const bigBossSchema = new Schema({
    role: {
        type: String,
        ref:"role"
    }
},
    {
    collection: "bigBoss",
    timestamps: true,
    versionKey: false
});

export interface BigBossProps {
    role: string,
    //TODO a mettre a jour (mettre restaurant[])
}

export type BigBossDocument = BigBossProps & Document;

export const BigBossModel: Model<BigBossDocument> = mongoose.model<BigBossDocument>("BigBoss", bigBossSchema);
