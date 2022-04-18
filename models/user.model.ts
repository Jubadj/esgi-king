import mongoose, {Schema, Document, Model} from "mongoose";
import {SessionProps} from "./session.model";


const userSchema = new Schema({
    login: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        required: true
    },
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: "Session"
    }],
    firstName: {
        type: Schema.Types.String,
        required: true
    },
    lastName: {
        type: Schema.Types.String,
        required: true
    },
},
    {
    collection: "users",
    timestamps: true,
    versionKey: false
});

export interface UserProps {
    _id: string;
    login: string;
    password: string;
    role: string;
    sessions: string[] | SessionProps[];
    firstName: string;
    lastName: string;
}

export type UserDocument = UserProps & Document;
export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);
