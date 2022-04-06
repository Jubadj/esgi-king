import mongoose, {Schema, Document, Model} from "mongoose";


const adminSchema = new Schema({
        firstname: {
            type: Schema.Types.String,
            required: true
        },
        lastname: {
            type: Schema.Types.String,
            required: true
        },
        birthdate: {
            type: Schema.Types.String,
            required: true
        }
    },
    {
        collection: "admins",
        timestamps: true,
        versionKey: false
    });

export interface AdminProps{
    firstname: string;
    lastname: number;
    birthdate: number;
}

export type AdminDocument = AdminProps & Document;

export const AdminModel = mongoose.model<AdminDocument>("Admin", adminSchema);