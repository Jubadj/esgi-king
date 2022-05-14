import { Document, Model } from "mongoose";
import { SessionProps } from "./session.model";
export interface UserProps {
    _id: string;
    login: string;
    password: string;
    role: string;
    sessions: string[] | SessionProps[];
    firstName: string;
    lastName: string;
}
export declare type UserDocument = UserProps & Document;
export declare const UserModel: Model<UserDocument>;
