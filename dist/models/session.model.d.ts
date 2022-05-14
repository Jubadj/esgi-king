import { Document, Model } from "mongoose";
import { UserDocument, UserProps } from "./user.model";
export interface SessionProps {
    _id: string;
    user: string | UserProps | UserDocument;
    platform: string;
    expiration?: Date;
}
export declare type SessionDocument = SessionProps & Document;
export declare const SessionModel: Model<SessionDocument>;
