import { Document, Model } from "mongoose";
export interface AdminProps {
    username: string;
    restaurant?: string;
}
export declare type AdminDocument = AdminProps & Document;
export declare const AdminModel: Model<AdminDocument>;
